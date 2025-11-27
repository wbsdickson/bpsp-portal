"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppStore } from "@/lib/store";
import { BankAccount } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import { deleteBankAccountAction } from "./actions";

interface DeleteBankAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bankAccount: BankAccount | null;
}

export function DeleteBankAccountDialog({ open, onOpenChange, bankAccount }: DeleteBankAccountDialogProps) {
    const { deleteBankAccount } = useAppStore();
    const [isPending, setIsPending] = useState(false);

    async function onDelete() {
        if (!bankAccount) return;

        setIsPending(true);
        const formData = new FormData();
        formData.append("id", bankAccount.id);

        try {
            const result = await deleteBankAccountAction({}, formData);

            if (result.success) {
                toast.success(result.message);
                deleteBankAccount(bankAccount.id);
                onOpenChange(false);
            } else {
                toast.error(result.message || "Failed to delete bank account");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the bank account
                        <strong> {bankAccount?.bankName} - {bankAccount?.accountNumber}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => {
                        e.preventDefault();
                        onDelete();
                    }} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
