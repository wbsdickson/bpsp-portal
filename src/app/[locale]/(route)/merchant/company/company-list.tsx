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
import { Company, User } from "@/lib/types";
import { CompanyForm } from "./company-form";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";


export function CompanyList() {
  const { getCompanies, deleteCompany, currentUser } = useAppStore();
  const companies = getCompanies();
  const isViewer = currentUser?.memberRole === "viewer";

  const [modalOpen, setModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);

  const handleDelete = async (id: string) => {
    deleteCompany(id);
  };

  const handleEditClick = (company: Company) => {
    setCompanyToEdit(company);
    setModalOpen(true);
  };

  const handleCreateClick = () => {
    setCompanyToEdit({
      id: "",
      name: "",
      address: "",
      phoneNumber: "",
      invoiceEmail: "",
      websiteUrl: "",
      invoicePrefix: "",
      enableCreditPayment: false,
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
              <Input placeholder="Search companies..." className="pl-8 w-[250px]" />
            </div>
          </div>
          {!isViewer && (
            <Button onClick={() => handleCreateClick()}>
              <Plus className="mr-2 h-4 w-4" /> Create Company
            </Button>
          )}
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant Name</TableHead>
                <TableHead> Address </TableHead>
                <TableHead> Phone Number </TableHead>
                <TableHead> Invoice Email </TableHead>
                <TableHead> Website URL </TableHead>
                <TableHead> Invoice Prefix </TableHead>
                <TableHead> Enable Credit Payment </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isViewer ? 5 : 6} className="text-center py-8 text-muted-foreground">
                    No companies have been registered.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.address}</TableCell>
                    <TableCell>{company.phoneNumber}</TableCell>
                    <TableCell>{company.invoiceEmail}</TableCell>
                    <TableCell>{company.websiteUrl}</TableCell>
                    <TableCell>{company.invoicePrefix}</TableCell>
                    <TableCell>{company.enableCreditPayment ? <Badge className="bg-green-500">Enabled</Badge> : <Badge variant="secondary">Disabled</Badge>}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditClick(company)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(company.id)}>
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
          totalItems={companies.length}
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
          {companyToEdit && (
            <CompanyForm company={companyToEdit} onSuccess={() => setModalOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
