"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { Edit, MoreHorizontal, Plus, Trash2, Search } from "lucide-react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { User } from "@/lib/types";
import { AccountForm } from "./account-form";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";


export function AccountList() {
  const { getAccounts, deleteAccount, currentUser } = useAppStore();
  const accounts = getAccounts();
  const isViewer = currentUser?.memberRole === "viewer";

  const [modalOpen, setModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<User | null>(null);

  const handleDelete = async (id: string) => {
    deleteAccount(id);
  };

  const handleEditClick = (account: User) => {
    setAccountToEdit(account);
    setModalOpen(true);
  };

  const handleCreateClick = () => {
    setAccountToEdit({
      id: "",
      name: "",
      email: "",
      role: "merchant",
      status: "active",
      createdAt: new Date().toISOString(),
    });
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search accounts..." className="pl-8 w-[250px]" />
            </div>
          </div>
          {!isViewer && (
            <Button onClick={() => handleCreateClick()}>
              <Plus className="mr-2 h-4 w-4" /> Create Account
            </Button>
          )}
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isViewer ? 5 : 6} className="text-center py-8 text-muted-foreground">
                    No accounts have been registered.
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell className="capitalize">{account.role}</TableCell>
                    <TableCell>{account.createdAt}</TableCell>
                    <TableCell>
                      {account.status === "active" ? (
                        <Badge className="bg-green-500">Enabled</Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                    </TableCell>
                    {!isViewer && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(account)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(account.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationControls
          currentPage={1}
          totalPages={1}
          itemsPerPage={20}
          totalItems={accounts.length}
          onPageChange={(page) => {
            console.log(page);
          }}
          onItemsPerPageChange={(value) => {
            console.log(value);
          }}
        />
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          {accountToEdit && (
            <AccountForm account={accountToEdit} onSuccess={() => setModalOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
