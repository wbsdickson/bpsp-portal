"use client";

import { Badge } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAutoIssuanceBadgeVariant } from "./_components/status";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { Edit, MoreHorizontal, Plus, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { deleteAutoIssuanceAction } from "./actions";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface AutoIssuanceListProps {
  merchantId: string;
}

export function AutoIssuanceList({ merchantId }: AutoIssuanceListProps) {
  const router = useRouter();
  const {
    getMerchantInvoiceAutoSettings,
    getMerchantClients,
    deleteInvoiceAutoSetting,
    currentUser,
  } = useAppStore();
  const settings = getMerchantInvoiceAutoSettings(merchantId);
  const clients = getMerchantClients(merchantId);

  const isViewer = currentUser?.memberRole === "viewer";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const getClientName = (clientId: string) => {
    return clients.find((c) => c.id === clientId)?.name || "Unknown Client";
  };

  const filteredSettings = settings.filter((setting) => {
    const matchesSearch =
      setting.scheduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(setting.clientId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "enabled"
          ? setting.enabled
          : !setting.enabled;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSettings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSettings = filteredSettings.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    const formData = new FormData();
    formData.append("id", id);

    try {
      const result = await deleteAutoIssuanceAction({}, formData);
      if (result.success) {
        deleteInvoiceAutoSetting(id);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete schedule");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
            <Input
              placeholder="Search schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px] pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="enabled">Enabled</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!isViewer && (
          <Button asChild>
            <Link href="/dashboard/merchant/simple-invoice-auto/create">
              <Plus /> Create Schedule
            </Link>
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Schedule Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next Issuance</TableHead>
              <TableHead>Status</TableHead>
              {!isViewer && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSettings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isViewer ? 5 : 6}
                  className="text-muted-foreground py-8 text-center"
                >
                  No auto-issuance settings have been registered.
                </TableCell>
              </TableRow>
            ) : (
              filteredSettings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell className="font-medium">
                    {setting.scheduleName}
                  </TableCell>
                  <TableCell>{getClientName(setting.clientId)}</TableCell>
                  <TableCell className="capitalize">
                    {setting.intervalValue} {setting.intervalType}(s)
                  </TableCell>
                  <TableCell>
                    {format(new Date(setting.nextIssuanceDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {setting.enabled ? (
                      <Badge variant="success">Enabled</Badge>
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
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/merchant/simple-invoice-auto/${setting.id}/edit`,
                              )
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(setting.id)}
                          >
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
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredSettings.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
