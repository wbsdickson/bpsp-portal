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
import { useState, useEffect } from "react";
import { BankAccountDialog } from "./bank-account-dialog";
import { DeleteBankAccountDialog } from "./delete-bank-account-dialog";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BankAccountList() {
    const { currentUser, getMerchantBankAccounts } = useAppStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
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
        const matchesSearch =
            account.bankName.toLowerCase().includes(query) ||
            (account.branchName || "").toLowerCase().includes(query) ||
            account.accountHolder.toLowerCase().includes(query);

        const matchesType = typeFilter === "ALL" || account.accountType === typeFilter;

        return matchesSearch && matchesType;
    });

    // Sort by created date descending
    const sortedAccounts = [...filteredAccounts].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAccounts = sortedAccounts.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, typeFilter]);

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
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="savings">Savings (普通)</SelectItem>
                            <SelectItem value="checking">Checking (当座)</SelectItem>
                        </SelectContent>
                    </Select>
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
                        {paginatedAccounts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No bank accounts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedAccounts.map((account) => (
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

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} entries
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${itemsPerPage}`}
                            onValueChange={(value) => {
                                setItemsPerPage(Number(value))
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={itemsPerPage} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
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
