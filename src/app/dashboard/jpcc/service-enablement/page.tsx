'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

const initialUsers = [
    {
        id: "USR-001",
        name: "Alice",
        email: "alice@example.com",
        jpccEnabled: false,
        bpspEnabled: true,
    },
    {
        id: "USR-002",
        name: "Eve",
        email: "eve@example.com",
        jpccEnabled: true,
        bpspEnabled: true,
    },
];

export default function ServiceEnablementPage() {
    const [users, setUsers] = useState(initialUsers);

    const toggleService = (userId: string, service: 'jpccEnabled' | 'bpspEnabled') => {
        setUsers(users.map(user => {
            if (user.id === userId) {
                const newValue = !user[service];
                toast.success(`${service === 'jpccEnabled' ? 'JPCC' : 'BPSP'} service ${newValue ? 'enabled' : 'disabled'} for ${user.name}`);
                return { ...user, [service]: newValue };
            }
            return user;
        }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Service Enablement</h2>
                <p className="text-muted-foreground">Manage service access for users.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Service Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-center">JPCC Service</TableHead>
                                <TableHead className="text-center">BPSP Service</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={user.jpccEnabled}
                                                onCheckedChange={() => toggleService(user.id, 'jpccEnabled')}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={user.bpspEnabled}
                                                onCheckedChange={() => toggleService(user.id, 'bpspEnabled')}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

