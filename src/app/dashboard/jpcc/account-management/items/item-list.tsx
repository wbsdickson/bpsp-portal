"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import { Item } from "@/lib/types";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteItemDialog } from "./delete-item-dialog";
import { ItemDialog } from "./item-dialog";

interface ItemListProps {
    merchantId: string;
}

export function ItemList({ merchantId }: ItemListProps) {
    const { getMerchantItems, taxes } = useAppStore();
    const items = getMerchantItems(merchantId);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [deletingItem, setDeletingItem] = useState<Item | null>(null);

    const getTaxName = (taxId: string) => {
        return taxes.find(t => t.id === taxId)?.name || "Unknown";
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Items</h2>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Register Item
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Tax Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No items registered yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        {item.unitPrice
                                            ? `¥${item.unitPrice.toLocaleString()}`
                                            : "-"}
                                    </TableCell>
                                    <TableCell>{getTaxName(item.taxId)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingItem(item)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeletingItem(item)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ItemDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                merchantId={merchantId}
            />

            {editingItem && (
                <ItemDialog
                    open={!!editingItem}
                    onOpenChange={(open) => !open && setEditingItem(null)}
                    item={editingItem}
                    merchantId={merchantId}
                />
            )}

            {deletingItem && (
                <DeleteItemDialog
                    open={!!deletingItem}
                    onOpenChange={(open) => !open && setDeletingItem(null)}
                    item={deletingItem}
                />
            )}
        </div>
    );
}
