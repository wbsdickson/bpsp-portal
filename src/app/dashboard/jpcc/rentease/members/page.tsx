import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const members = [
    { name: "Alice Johnson", role: "Tenant", status: "Active", avatar: "AJ" },
    { name: "Bob Smith", role: "Landlord", status: "Active", avatar: "BS" },
    { name: "Carol White", role: "Tenant", status: "Pending", avatar: "CW" },
    { name: "David Brown", role: "Agent", status: "Active", avatar: "DB" },
];

export default function MembersPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Members</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member, i) => (
                    <Card key={i}>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback>{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {member.status.replace(/_/g, ' ').toUpperCase()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
