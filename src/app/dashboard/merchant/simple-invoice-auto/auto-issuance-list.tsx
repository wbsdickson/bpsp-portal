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
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAutoIssuanceAction } from "./actions";

interface AutoIssuanceListProps {
    merchantId: string;
}

export function AutoIssuanceList({ merchantId }: AutoIssuanceListProps) {
    const router = useRouter();
    const { getMerchantInvoiceAutoSettings, getMerchantClients, deleteInvoiceAutoSetting, currentUser } = useAppStore();
    const settings = getMerchantInvoiceAutoSettings(merchantId);
    const clients = getMerchantClients(merchantId);

    const isViewer = currentUser?.memberRole === 'viewer';

    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.name || "Unknown Client";
    };

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
            <div className="flex justify-end">
                {!isViewer && (
                    <Button asChild>
                        <Link href="/dashboard/merchant/simple-invoice-auto/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Schedule
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
                            {!isViewer && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {settings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isViewer ? 5 : 6} className="text-center py-8 text-muted-foreground">
                                    No auto-issuance settings have been registered.
                                </TableCell>
                            </TableRow>
                        ) : (
                            settings.map((setting) => (
                                <TableRow key={setting.id}>
                                    <TableCell className="font-medium">{setting.scheduleName}</TableCell>
                                    <TableCell>{getClientName(setting.clientId)}</TableCell>
                                    <TableCell className="capitalize">
                                        {setting.intervalValue} {setting.intervalType}(s)
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(setting.nextIssuanceDate), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        {setting.enabled ? (
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
                                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/merchant/simple-invoice-auto/${setting.id}/edit`)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(setting.id)}>
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
        </div>
    );
}
