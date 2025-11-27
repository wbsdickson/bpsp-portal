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
import { useAppStore } from "@/lib/store";
import { Item } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import { deleteItemAction } from "./actions";

interface DeleteItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: Item;
}

export function DeleteItemDialog({ open, onOpenChange, item }: DeleteItemDialogProps) {
    const { deleteItem } = useAppStore();
    const [isPending, setIsPending] = useState(false);

    async function onDelete() {
        setIsPending(true);
        try {
            const formData = new FormData();
            formData.append("id", item.id);
            const result = await deleteItemAction({}, formData);

            if (result.success) {
                toast.success(result.message);
                deleteItem(item.id);
                onOpenChange(false);
            } else {
                toast.error(result.message || "Failed to delete item");
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
                    <DialogTitle>Delete Item</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{item.name}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onDelete}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
