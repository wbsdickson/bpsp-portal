"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DollarSign,
  FileText,
  CreditCard,
  Bell,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { format, isSameMonth, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import HeaderPage from "@/components/header-page";

import {
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_NOTIFICATION_READS,
} from "@/lib/mock-data";
import { AppUser } from "@/types/user";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function MerchantDashboard() {
  const t = useTranslations("Merchant.Dashboard");
  const session = useSession();


  const currentUser = session.data?.user as AppUser;
  const merchantId = currentUser?.merchantId || currentUser?.id;


  const invoices = MOCK_INVOICES.filter(
    (inv) => inv.merchantId === merchantId && !inv.deletedAt
  );
  const payments = MOCK_PAYMENTS.filter(
    (pay) => pay.merchantId === merchantId
  );

  const now = new Date();
  const notifications = MOCK_NOTIFICATIONS.filter((notif) => {
    if (
      notif.targetUserType &&
      notif.targetUserType !== "merchant" &&
      notif.targetUserType !== "all"
    ) {
      return false;
    }

    if (notif.merchantId && notif.merchantId !== merchantId) {
      return false;
    }

    if (
      notif.publicationStartDate &&
      new Date(notif.publicationStartDate) > now
    ) {
      return false;
    }
    if (
      notif.publicationEndDate &&
      new Date(notif.publicationEndDate) < now
    ) {
      return false;
    }

    return true;
  }).map((notif) => {
    let isRead = false;
    const readRecord = MOCK_NOTIFICATION_READS.find(
      (nr) => nr.notificationId === notif.id && nr.userId === currentUser.id
    );
    if (readRecord) {
      isRead = true;
    } else if (notif.isRead && notif.merchantId) {
      isRead = true;
    } else {
      isRead = !!notif.isRead;
    }

    return { ...notif, isRead };
  }).sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
    return dateB - dateA;
  });



  const invoicesThisMonth = invoices.filter((inv) =>
    isSameMonth(parseISO(inv.createdAt), now)
  ).length;

  const salesThisMonth = payments
    .filter((pay) => isSameMonth(parseISO(pay.createdAt), now))
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const outstandingAmount = invoices
    .filter((inv) => inv.status === "pending" || inv.status === "approved")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const amountPaid = payments
    .filter((pay) => pay.status === "settled")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const recentTransactions = payments
    .filter((pay) => pay.status !== "failed")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  const recentNotifications = notifications.slice(0, 5);

  if (
    invoices.length === 0 &&
    payments.length === 0 &&
    notifications.length === 0
  ) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">{t("no_data_available")}</h2>
          <p className="text-muted-foreground">{t("no_data_available")}</p>
        </div>
      </div>
    );
  }

  return (
    <HeaderPage title={t("title")}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {t("welcome_back")}, {currentUser.name}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium">
                    {t("invoices_this_month")}
                  </p>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {invoicesThisMonth}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>{t("issued_this_month")}</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium">
                    {t("sales_this_month")}
                  </p>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {salesThisMonth.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>{t("total_transaction_volume")}</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium">
                    {t("outstanding_amount")}
                  </p>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    ${outstandingAmount.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {t("pending_approved_invoices")}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium">
                    {t("amount_paid")}
                  </p>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    ${amountPaid.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>{t("total_settled_amount")}</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Transactions */}
          <Card className="col-span-4 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>{t("recent_transactions")}</CardTitle>
              <CardDescription>
                {t("latest_10_successful_transactions")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("invoice_id")}</TableHead>
                    <TableHead>{t("method")}</TableHead>
                    <TableHead className="text-right">{t("amount")}</TableHead>
                    <TableHead className="text-right">{t("status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(parseISO(payment.createdAt), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>{payment.invoiceId}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        ${payment.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            payment.status === "settled"
                              ? "success"
                              : payment.status === "pending_approval"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {t(payment.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentTransactions.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-muted-foreground text-center"
                      >
                        {t("no_recent_transactions_found")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="col-span-3 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>{t("notifications")}</CardTitle>
              <CardDescription>{t("latest_5_updates")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 rounded-lg p-3 ${notification.type === "error"
                        ? "bg-red-50/50 dark:bg-red-900/10"
                        : notification.type === "warning"
                          ? "bg-amber-50/50 dark:bg-amber-900/10"
                          : notification.type === "success"
                            ? "bg-emerald-50/50 dark:bg-emerald-900/10"
                            : "bg-blue-50/50 dark:bg-blue-900/10"
                        }`}
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notification.type === "error"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : notification.type === "warning"
                            ? "bg-amber-100 dark:bg-amber-900/30"
                            : notification.type === "success"
                              ? "bg-emerald-100 dark:bg-emerald-900/30"
                              : "bg-blue-100 dark:bg-blue-900/30"
                          }`}
                      >
                        <Bell
                          className={`h-4 w-4 ${notification.type === "error"
                            ? "text-red-600 dark:text-red-400"
                            : notification.type === "warning"
                              ? "text-amber-600 dark:text-amber-400"
                              : notification.type === "success"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-blue-600 dark:text-blue-400"
                            }`}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {notification.message}
                        </p>
                        <p className="text-muted-foreground pt-1 text-xs">
                          {format(
                            parseISO(notification.createdAt),
                            "yyyy-MM-dd HH:mm",
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentNotifications.length === 0 && (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                      {t("no_notifications")}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </HeaderPage>
  );
}
