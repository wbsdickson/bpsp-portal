'use client';

import { useAppStore } from '@/lib/store';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Settings } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/lib/types';
import { toast } from 'sonner';

export default function TenantsPage() {
    const router = useRouter();
    const { users, loginAsUser, updateUser, logout } = useAppStore();
    const merchants = users.filter(u => u.role === 'merchant');
    const [selectedMerchant, setSelectedMerchant] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        status: 'active',
        customFeePercentage: '2.0'
    });

    const handleSwitchView = (merchantId: string) => {
        toast.info("Switching to merchant view...");
        // Simulate logout and login
        logout();
        setTimeout(() => {
            loginAsUser(merchantId);
            router.push('/dashboard/merchant');
            toast.success("Logged in as merchant");
        }, 500);
    };

    const openManageDialog = (merchant: User) => {
        setSelectedMerchant(merchant);
        setFormData({
            status: merchant.status || 'active',
            customFeePercentage: merchant.customFeePercentage?.toString() || '2.0'
        });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (selectedMerchant) {
            updateUser(selectedMerchant.id, {
                status: formData.status as 'active' | 'suspended',
                customFeePercentage: parseFloat(formData.customFeePercentage)
            });
            toast.success(`Tenant ${selectedMerchant.companyName} updated successfully`);
            setIsDialogOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tenant Management / テナント管理</h1>
                <Button>Onboard Merchant</Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Merchant</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {merchants.map((merchant) => (
                            <TableRow key={merchant.id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={merchant.avatarUrl} />
                                        <AvatarFallback>{merchant.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{merchant.name}</span>
                                </TableCell>
                                <TableCell>{merchant.companyName}</TableCell>
                                <TableCell>{merchant.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={merchant.status === 'suspended'
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : "bg-green-50 text-green-700 border-green-200"
                                        }
                                    >
                                        {merchant.status || 'active'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openManageDialog(merchant)}
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Manage
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSwitchView(merchant.id)}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    >
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Switch View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Tenant</DialogTitle>
                        <DialogDescription>
                            Update settings for {selectedMerchant?.companyName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fee" className="text-right">
                                Fee (%)
                            </Label>
                            <Input
                                id="fee"
                                type="number"
                                step="0.1"
                                value={formData.customFeePercentage}
                                onChange={(e) => setFormData({ ...formData, customFeePercentage: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
