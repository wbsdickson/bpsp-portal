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
import { MerchantCard } from "@/lib/types";
import { Trash } from "lucide-react";
import { useState } from "react";
import { DeleteCardDialog } from "./delete-card-dialog";

export function CardList() {
    const { currentUser, getMerchantCards } = useAppStore();
    const [deletingCard, setDeletingCard] = useState<MerchantCard | null>(null);

    if (!currentUser) return null;

    const merchantId = currentUser.merchantId || currentUser.id;
    const cards = getMerchantCards(merchantId);

    // Access Control
    // owner: delete
    // staff, viewer: view-only (cannot delete)
    const canDelete = currentUser.memberRole === 'owner' || currentUser.role === 'merchant';

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Card Brand</TableHead>
                            <TableHead>Last 4 Digits</TableHead>
                            <TableHead>Expiration Date</TableHead>
                            <TableHead>Registration Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cards.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No registered cards.
                                </TableCell>
                            </TableRow>
                        ) : (
                            cards.map((card) => (
                                <TableRow key={card.id}>
                                    <TableCell className="font-medium">{card.cardBrand}</TableCell>
                                    <TableCell>**** {card.last4}</TableCell>
                                    <TableCell>{card.expiryMonth}/{card.expiryYear}</TableCell>
                                    <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        {canDelete && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeletingCard(card)}
                                            >
                                                <Trash className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <DeleteCardDialog
                open={!!deletingCard}
                onOpenChange={(open) => !open && setDeletingCard(null)}
                card={deletingCard}
            />
        </div>
    );
}
