import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const users = [
    {
        id: "USR-001",
        username: "john_doe",
        status: "active",
        createdDate: "2023-10-15",
        role: "Admin"
    },
    {
        id: "USR-002",
        username: "jane_smith",
        status: "active",
        createdDate: "2023-10-18",
        role: "User"
    },
    {
        id: "USR-003",
        username: "bob_wilson",
        status: "suspended",
        createdDate: "2023-11-02",
        role: "User"
    },
    {
        id: "USR-004",
        username: "alice_brown",
        status: "active",
        createdDate: "2023-11-05",
        role: "Manager"
    },
    {
        id: "USR-005",
        username: "charlie_davis",
        status: "pending",
        createdDate: "2023-11-12",
        role: "User"
    },
    {
        id: "USR-006",
        username: "eva_green",
        status: "active",
        createdDate: "2023-11-15",
        role: "User"
    },
    {
        id: "USR-007",
        username: "frank_white",
        status: "suspended",
        createdDate: "2023-11-20",
        role: "User"
    },
];

export default function UserManagementPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Users List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Created Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.status === 'active' ? 'default' :
                                                    user.status === 'suspended' ? 'destructive' : 'secondary'
                                            }
                                            className={
                                                user.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''
                                            }
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{user.createdDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}