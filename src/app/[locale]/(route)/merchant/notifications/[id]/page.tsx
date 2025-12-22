"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";

interface NotificationDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function NotificationDetailsPage({ params }: NotificationDetailsPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { currentUser, getMerchantNotifications, markNotificationAsRead } = useAppStore();

    // We fetch all notifications to find the specific one. 
    // In a real app, we might have a specific getNotificationById action, 
    // but reusing getMerchantNotifications ensures security checks (merchantId match) are applied.
    const notifications = currentUser?.merchantId
        ? getMerchantNotifications(currentUser.merchantId, currentUser.id)
        : [];

    const notification = notifications.find(n => n.id === id);

    useEffect(() => {
        if (notification && currentUser && !notification.isRead) {
            markNotificationAsRead(notification.id, currentUser.id);
        }
    }, [notification, currentUser, markNotificationAsRead]);

    if (!currentUser?.merchantId) {
        return <div>Access Denied</div>;
    }

    if (!notification) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notifications
                </Button>
                <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                        No matching notification found.
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notifications
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-2xl">{notification.title}</CardTitle>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${notification.type === 'info' ? 'bg-blue-100 text-blue-800' :
                                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                    notification.type === 'error' ? 'bg-red-100 text-red-800' :
                                        'bg-green-100 text-green-800'
                                }`}>
                                {notification.type.toUpperCase()}
                            </span>
                        </div>
                        <CardDescription className="flex items-center gap-4 text-sm">
                            <span className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {format(new Date(notification.publicationStartDate || notification.createdAt), "MMMM d, yyyy h:mm a")}
                            </span>
                            <span className="flex items-center">
                                <User className="mr-1 h-3 w-3" />
                                From: {notification.createdBy || "System"}
                            </span>
                        </CardDescription>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <div className="prose max-w-none whitespace-pre-wrap">
                        {notification.message}
                    </div>

                    <div className="mt-8 text-xs text-muted-foreground">
                        Last Updated: {format(new Date(notification.updatedAt || notification.createdAt), "MMM d, yyyy")}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
