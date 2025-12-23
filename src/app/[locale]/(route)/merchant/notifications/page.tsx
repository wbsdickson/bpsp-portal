"use client";

import HeaderPage from "@/components/header-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { Eye, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NotificationsPage() {
  const { currentUser, getMerchantNotifications } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (!currentUser?.merchantId) {
    return <div>Access Denied</div>;
  }

  const notifications = getMerchantNotifications(
    currentUser.merchantId,
    currentUser.id,
  );

  const filteredNotifications = notifications.filter((notif) => {
    // Filter by Title
    if (
      searchQuery &&
      !notif.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by Status
    if (statusFilter === "unread" && notif.isRead) return false;
    if (statusFilter === "read" && !notif.isRead) return false;

    return true;
  });

  return (
    <HeaderPage title="Notifications">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground py-8 text-center"
                    >
                      No notifications are currently available.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notif) => (
                    <TableRow
                      key={notif.id}
                      className={!notif.isRead ? "bg-muted/20" : ""}
                    >
                      <TableCell>
                        {!notif.isRead && (
                          <Badge variant="destructive" className="mr-2">
                            NEW
                          </Badge>
                        )}
                        {notif.isRead && (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            Read
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {notif.title}
                      </TableCell>
                      <TableCell>
                        {format(
                          new Date(
                            notif.publicationStartDate || notif.createdAt,
                          ),
                          "MMM d, yyyy",
                        )}
                      </TableCell>
                      <TableCell>
                        {notif.merchantId
                          ? "Specific Merchant"
                          : "All Merchants"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/dashboard/merchant/notifications/${notif.id}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </HeaderPage>
  );
}
