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
import { MemberRole, User } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createMember, updateMember } from "./actions";

const memberFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["owner", "staff", "viewer"] as [string, ...string[]]),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

interface MemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member?: User | null; // If provided, it's edit mode
    merchantId: string;
}

export function MemberDialog({ open, onOpenChange, member, merchantId }: MemberDialogProps) {
    const { addMember, updateMember: updateMemberStore } = useAppStore();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<MemberFormValues>({
        resolver: zodResolver(memberFormSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "staff",
        },
    });

    useEffect(() => {
        if (member) {
            form.reset({
                name: member.name,
                email: member.email,
                role: member.memberRole || "staff",
            });
        } else {
            form.reset({
                name: "",
                email: "",
                role: "staff",
            });
        }
    }, [member, form, open]);

    async function onSubmit(data: MemberFormValues) {
        setIsPending(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("role", data.role);
        if (member) {
            formData.append("id", member.id);
        }

        try {
            const action = member ? updateMember : createMember;
            const result = await action({}, formData);

            if (result.success && result.data) {
                toast.success(result.message);
                if (member) {
                    updateMemberStore(member.id, {
                        name: data.name,
                        email: data.email,
                        memberRole: data.role as MemberRole,
                    });
                } else {
                    addMember({
                        id: result.data.id,
                        name: data.name,
                        email: data.email,
                        role: 'merchant', // Default system role
                        memberRole: data.role as MemberRole,
                        merchantId: merchantId,
                        status: 'active',
                        createdAt: (result.data as any).createdAt,
                        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
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
                    <DialogTitle>{member ? "Edit Member" : "Add Member"}</DialogTitle>
                    <DialogDescription>
                        {member
                            ? "Update member details here."
                            : "Add a new member to your organization."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="owner">Owner</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
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
