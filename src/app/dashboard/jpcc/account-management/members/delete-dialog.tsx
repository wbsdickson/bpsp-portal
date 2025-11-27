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
import { User } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import { deleteMemberAction } from "./actions";

interface DeleteMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: User | null;
}

export function DeleteMemberDialog({ open, onOpenChange, member }: DeleteMemberDialogProps) {
    const { deleteMember } = useAppStore();
    const [isPending, setIsPending] = useState(false);

    async function onDelete() {
        if (!member) return;

        setIsPending(true);
        const formData = new FormData();
        formData.append("id", member.id);

        try {
            const result = await deleteMemberAction({}, formData);

            if (result.success) {
                toast.success(result.message);
                deleteMember(member.id);
                onOpenChange(false);
            } else {
                toast.error(result.message || "Failed to delete member");
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
                        This action cannot be undone. This will permanently delete the member
                        account for <strong>{member?.name}</strong> and remove their access to the organization.
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
