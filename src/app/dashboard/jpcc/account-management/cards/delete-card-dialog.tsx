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
import { MerchantCard } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import { deleteCardAction } from "./actions";

interface DeleteCardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    card: MerchantCard | null;
}

export function DeleteCardDialog({ open, onOpenChange, card }: DeleteCardDialogProps) {
    const { deleteMerchantCard } = useAppStore();
    const [isPending, setIsPending] = useState(false);

    async function handleDelete() {
        if (!card) return;

        setIsPending(true);
        const formData = new FormData();
        formData.append("id", card.id);

        try {
            const result = await deleteCardAction({}, formData);

            if (result.success) {
                toast.success(result.message);
                deleteMerchantCard(card.id);
                onOpenChange(false);
            } else {
                toast.error(result.message || "Failed to delete card");
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
                        This action cannot be undone. This will permanently delete the card
                        ending in <strong>{card?.last4}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
