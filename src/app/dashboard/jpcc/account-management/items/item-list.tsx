"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { DeleteItemDialog } from "./delete-item-dialog";
import { ItemDialog } from "./item-dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface ItemListProps {
    merchantId: string;
}

export function ItemList({ merchantId }: ItemListProps) {
    const { getMerchantItems, taxes } = useAppStore();
    const items = getMerchantItems(merchantId);

    const [searchQuery, setSearchQuery] = useState("");
    const [taxFilter, setTaxFilter] = useState<string>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [deletingItem, setDeletingItem] = useState<Item | null>(null);

    const getTaxName = (taxId: string) => {
        return taxes.find(t => t.id === taxId)?.name || "Unknown";
    };

    // Filter items
    const filteredItems = items.filter((item) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = item.name.toLowerCase().includes(query);
        const matchesTax = taxFilter === "ALL" || item.taxId === taxFilter;
        return matchesSearch && matchesTax;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, taxFilter]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 w-[250px]"
                        />
                    </div>
                    <Select value={taxFilter} onValueChange={setTaxFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Tax" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Taxes</SelectItem>
                            {taxes.map((tax) => (
                                <SelectItem key={tax.id} value={tax.id}>
                                    {tax.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
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
                        {paginatedItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No items found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedItems.map((item) => (
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

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredItems.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                }}
            />

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
