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
import { Client } from "@/lib/types";
import { Edit, MoreHorizontal, Plus, Search, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { ClientDialog } from "./client-dialog";
import { DeleteClientDialog } from "./delete-client-dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";

export function ClientList() {
    const { currentUser, getMerchantClients } = useAppStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [deletingClient, setDeletingClient] = useState<Client | null>(null);

    if (!currentUser) return null;

    const merchantId = currentUser.merchantId || currentUser.id;
    const clients = getMerchantClients(merchantId);

    // Filter clients
    const filteredClients = clients.filter((client) => {
        const query = searchQuery.toLowerCase();
        return (
            client.name.toLowerCase().includes(query) ||
            client.email.toLowerCase().includes(query) ||
            client.phoneNumber.toLowerCase().includes(query)
        );
    });

    // Sort by created date descending
    const sortedClients = [...filteredClients].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedClients = sortedClients.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

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
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 w-[250px]"
                        />
                    </div>
                </div>
                {canManage && (
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Client
                    </Button>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Registered Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedClients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No clients have been registered.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedClients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>{client.phoneNumber}</TableCell>
                                    <TableCell>
                                        {new Date(client.createdAt).toLocaleDateString()}
                                    </TableCell>
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
                                                            setEditingClient(client);
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
                                                                onClick={() => setDeletingClient(client)}
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

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={sortedClients.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                }}
            />

            <ClientDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                merchantId={merchantId}
            />

            <ClientDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                client={editingClient}
                merchantId={merchantId}
            />

            <DeleteClientDialog
                open={!!deletingClient}
                onOpenChange={(open) => !open && setDeletingClient(null)}
                client={deletingClient}
            />
        </div>
    );
}
