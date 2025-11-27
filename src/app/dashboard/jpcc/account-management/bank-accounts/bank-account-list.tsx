"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import { BankAccount } from "@/lib/types";
import { Edit, MoreHorizontal, Plus, Search, Trash } from "lucide-react";
import { useState } from "react";
import { BankAccountDialog } from "./bank-account-dialog";
import { DeleteBankAccountDialog } from "./delete-bank-account-dialog";
import { Badge } from "@/components/ui/badge";

export function BankAccountList() {
    const { currentUser, getMerchantBankAccounts } = useAppStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [deletingAccount, setDeletingAccount] = useState<BankAccount | null>(null);

    if (!currentUser) return null;

    const merchantId = currentUser.merchantId || currentUser.id;
    const bankAccounts = getMerchantBankAccounts(merchantId);

    // Filter accounts
    const filteredAccounts = bankAccounts.filter((account) => {
        const query = searchQuery.toLowerCase();
        return (
            account.bankName.toLowerCase().includes(query) ||
            (account.branchName || "").toLowerCase().includes(query) ||
            account.accountHolder.toLowerCase().includes(query)
        );
    });

    // Sort by created date descending
    const sortedAccounts = [...filteredAccounts].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Access Control
    // owner, staff: accessible (view/edit/create)
    // viewer: view-only
    // delete: owner only
    const canManage = currentUser.memberRole === 'owner' || currentUser.memberRole === 'staff' || currentUser.role === 'merchant';
    const canDelete = currentUser.memberRole === 'owner' || currentUser.role === 'merchant';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search bank accounts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 w-[250px]"
                        />
                    </div>
                </div>
                {canManage && (
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Bank Account
                    </Button>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bank Name</TableHead>
                            <TableHead>Branch Name</TableHead>
                            <TableHead>Account Type</TableHead>
                            <TableHead>Account Number</TableHead>
                            <TableHead>Account Holder</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedAccounts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No bank accounts have been registered.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedAccounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell className="font-medium">{account.bankName}</TableCell>
                                    <TableCell>{account.branchName || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {account.accountType === 'savings' ? 'Savings (普通)' : 'Checking (当座)'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{account.accountNumber}</TableCell>
                                    <TableCell>{account.accountHolder}</TableCell>
                                    <TableCell className="text-right">
                                        {canManage && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setEditingAccount(account);
                                                            setIsEditOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    {canDelete && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => setDeletingAccount(account)}
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <BankAccountDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                merchantId={merchantId}
            />

            <BankAccountDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                bankAccount={editingAccount}
                merchantId={merchantId}
            />

            <DeleteBankAccountDialog
                open={!!deletingAccount}
                onOpenChange={(open) => !open && setDeletingAccount(null)}
                bankAccount={deletingAccount}
            />
        </div>
    );
}
