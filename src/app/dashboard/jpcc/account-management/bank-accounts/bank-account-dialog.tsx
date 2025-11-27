"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { BankAccount } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createBankAccount, updateBankAccount } from "./actions";

const bankAccountFormSchema = z.object({
    bankName: z.string().min(1, "Bank name is required"),
    branchName: z.string().optional(),
    accountType: z.enum(["savings", "checking"] as [string, ...string[]]),
    accountNumber: z.string().regex(/^\d{7}$/, "Account number must be 7 digits"),
    accountHolder: z.string().min(1, "Account holder name is required"),
});

type BankAccountFormValues = z.infer<typeof bankAccountFormSchema>;

interface BankAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bankAccount?: BankAccount | null; // If provided, it's edit mode
    merchantId: string;
}

export function BankAccountDialog({ open, onOpenChange, bankAccount, merchantId }: BankAccountDialogProps) {
    const { addBankAccount, updateBankAccount: updateBankAccountStore } = useAppStore();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<BankAccountFormValues>({
        resolver: zodResolver(bankAccountFormSchema),
        defaultValues: {
            bankName: "",
            branchName: "",
            accountType: "savings",
            accountNumber: "",
            accountHolder: "",
        },
    });

    useEffect(() => {
        if (bankAccount) {
            form.reset({
                bankName: bankAccount.bankName,
                branchName: bankAccount.branchName || "",
                accountType: bankAccount.accountType,
                accountNumber: bankAccount.accountNumber,
                accountHolder: bankAccount.accountHolder,
            });
        } else {
            form.reset({
                bankName: "",
                branchName: "",
                accountType: "savings",
                accountNumber: "",
                accountHolder: "",
            });
        }
    }, [bankAccount, form, open]);

    async function onSubmit(data: BankAccountFormValues) {
        setIsPending(true);
        const formData = new FormData();
        formData.append("bankName", data.bankName);
        if (data.branchName) formData.append("branchName", data.branchName);
        formData.append("accountType", data.accountType);
        formData.append("accountNumber", data.accountNumber);
        formData.append("accountHolder", data.accountHolder);

        if (bankAccount) {
            formData.append("id", bankAccount.id);
        }

        try {
            const action = bankAccount ? updateBankAccount : createBankAccount;
            const result = await action({}, formData);

            if (result.success && result.data) {
                toast.success(result.message);
                if (bankAccount) {
                    updateBankAccountStore(bankAccount.id, {
                        bankName: data.bankName,
                        branchName: data.branchName,
                        accountType: data.accountType as 'savings' | 'checking',
                        accountNumber: data.accountNumber,
                        accountHolder: data.accountHolder,
                    });
                } else {
                    addBankAccount({
                        id: result.data.id,
                        merchantId: merchantId,
                        bankName: data.bankName,
                        branchName: data.branchName,
                        accountType: data.accountType as 'savings' | 'checking',
                        accountNumber: data.accountNumber,
                        accountHolder: data.accountHolder,
                        createdAt: (result.data as any).createdAt,
                    } as any);
                }
                onOpenChange(false);
            } else {
                toast.error(result.message || "Operation failed");
                if (result.errors) {
                    Object.entries(result.errors).forEach(([key, messages]) => {
                        if (messages && messages.length > 0) {
                            form.setError(key as any, { message: messages[0] });
                        }
                    });
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{bankAccount ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle>
                    <DialogDescription>
                        {bankAccount
                            ? "Update bank account details here."
                            : "Register a new payout bank account."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Bank of America" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="branchName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch Name (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Main Branch" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="accountType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="savings">Savings (普通)</SelectItem>
                                                <SelectItem value="checking">Checking (当座)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1234567" maxLength={7} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="accountHolder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Holder Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="TechCorp Solutions" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
