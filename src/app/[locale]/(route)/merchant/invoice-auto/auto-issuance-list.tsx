"use client";

import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { Edit, Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { deleteInvoiceAutoSettingAction } from "./actions";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface AutoIssuanceListProps {
    merchantId: string;
}

export function AutoIssuanceList({ merchantId }: AutoIssuanceListProps) {
    const router = useRouter();
    const { getMerchantInvoiceAutoSettings, getMerchantClients, deleteInvoiceAutoSetting, currentUser } = useAppStore();
    const settings = getMerchantInvoiceAutoSettings(merchantId);
    const clients = getMerchantClients(merchantId);

    const isViewer = currentUser?.memberRole === 'viewer';

    // Filters
    const [direction, setDirection] = useState<'receivable' | 'payable'>('receivable');
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [clientFilter, setClientFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.name || "Unknown Client";
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this schedule?")) return;

        const formData = new FormData();
        formData.append("id", id);

        try {
            const result = await deleteInvoiceAutoSettingAction({}, formData);
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

    const getFrequencyLabel = (type: string, value: number) => {
        if (value === 1) {
            return `Every ${type}`;
        }
        return `Every ${value} ${type}s`;
    };

    // Filter Logic
    const filteredSettings = settings
        .filter(setting => setting.direction === direction || (!setting.direction && direction === 'receivable')) // Default to receivable if missing
        .filter(setting => {
            if (statusFilter === "all") return true;
            return statusFilter === "enabled" ? setting.enabled : !setting.enabled;
        })
        .filter(setting => {
            if (!clientFilter) return true;
            const clientName = getClientName(setting.clientId).toLowerCase();
            return clientName.includes(clientFilter.toLowerCase());
        })
        .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

    const totalPages = Math.ceil(filteredSettings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSettings = filteredSettings.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [direction, statusFilter, clientFilter]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Tabs value={direction} onValueChange={(v) => setDirection(v as any)} className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="receivable">Receivable (Income)</TabsTrigger>
                        <TabsTrigger value="payable">Payable (Expense)</TabsTrigger>
                    </TabsList>
                </Tabs>
                {!isViewer && (
                    <Button asChild>
                        <Link href="/dashboard/merchant/invoice-auto/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Schedule
                        </Link>
                    </Button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Filter by Client Name..."
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Schedule Name</TableHead>
                            <TableHead>Target Client</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Next Issuance</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedSettings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No {direction} auto-issuance settings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedSettings.map((setting) => (
                                <TableRow key={setting.id}>
                                    <TableCell className="font-medium">{setting.scheduleName}</TableCell>
                                    <TableCell>{getClientName(setting.clientId)}</TableCell>
                                    <TableCell>{getFrequencyLabel(setting.intervalType, setting.intervalValue)}</TableCell>
                                    <TableCell>{format(new Date(setting.nextIssuanceDate), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        {setting.enabled ? (
                                            <Badge className="bg-green-500">Enabled</Badge>
                                        ) : (
                                            <Badge variant="secondary">Disabled</Badge>
                                        )}
                                    </TableCell>
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
                                                <DropdownMenuItem onClick={() => router.push(`/dashboard/merchant/invoice-auto/${setting.id}`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                {!isViewer && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => router.push(`/dashboard/merchant/invoice-auto/${setting.id}/edit`)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(setting.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
