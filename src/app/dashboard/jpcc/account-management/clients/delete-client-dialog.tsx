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
import { Client } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import { deleteClientAction } from "./actions";

interface DeleteClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client: Client | null;
}

export function DeleteClientDialog({ open, onOpenChange, client }: DeleteClientDialogProps) {
    const { deleteClient } = useAppStore();
    const [isPending, setIsPending] = useState(false);

    async function onDelete() {
        if (!client) return;

        setIsPending(true);
        const formData = new FormData();
        formData.append("id", client.id);

        try {
            const result = await deleteClientAction({}, formData);

            if (result.success) {
                toast.success(result.message);
                deleteClient(client.id);
                onOpenChange(false);
            } else {
                toast.error(result.message || "Failed to delete client");
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
                        This action cannot be undone. This will permanently delete the client
                        <strong> {client?.name}</strong>. They will no longer be available for selection in invoices.
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
