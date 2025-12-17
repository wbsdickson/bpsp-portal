"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { InvoiceAutoSetting } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createInvoiceAutoSettingAction, updateInvoiceAutoSettingAction } from "./actions";

const autoIssuanceFormSchema = z.object({
    scheduleName: z.string().min(1, "Schedule name is required"),
    direction: z.enum(['receivable', 'payable']),
    clientId: z.string().min(1, "Client is required"),
    intervalType: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    intervalValue: z.coerce.number().min(1, "Interval value must be at least 1"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    templateId: z.string().min(1, "Template is required"),
    enabled: z.boolean().default(true),
});

type AutoIssuanceFormValues = z.infer<typeof autoIssuanceFormSchema>;

interface AutoIssuanceFormProps {
    setting?: InvoiceAutoSetting;
    merchantId: string;
}

export function AutoIssuanceForm({ setting, merchantId }: AutoIssuanceFormProps) {
    const router = useRouter();
    const { getMerchantClients, getMerchantInvoiceTemplates, addInvoiceAutoSetting, updateInvoiceAutoSetting } = useAppStore();
    const clients = getMerchantClients(merchantId);
    const templates = getMerchantInvoiceTemplates(merchantId);
    const [isPending, setIsPending] = useState(false);

    const form = useForm<AutoIssuanceFormValues>({
        resolver: zodResolver(autoIssuanceFormSchema) as any,
        defaultValues: {
            scheduleName: setting?.scheduleName || "",
            direction: setting?.direction || "receivable",
            clientId: setting?.clientId || "",
            intervalType: setting?.intervalType || "monthly",
            intervalValue: setting?.intervalValue || 1,
            startDate: setting?.startDate || new Date().toISOString().split('T')[0],
            endDate: setting?.endDate || "",
            templateId: setting?.templateId || "",
            enabled: setting?.enabled ?? true,
        },
    });

    async function onSubmit(data: AutoIssuanceFormValues) {
        setIsPending(true);
        const formData = new FormData();
        if (setting) formData.append("id", setting.id);
        formData.append("scheduleName", data.scheduleName);
        formData.append("direction", data.direction);
        formData.append("clientId", data.clientId);
        formData.append("intervalType", data.intervalType);
        formData.append("intervalValue", data.intervalValue.toString());
        if (data.startDate) formData.append("startDate", data.startDate);
        if (data.endDate) formData.append("endDate", data.endDate);
        formData.append("templateId", data.templateId);
        formData.append("enabled", String(data.enabled));

        try {
            const action = setting ? updateInvoiceAutoSettingAction : createInvoiceAutoSettingAction;
            const result = await action({}, formData);

            if (result.success && result.data) {
                toast.success(result.message);
                if (setting) {
                    updateInvoiceAutoSetting(setting.id, result.data as Partial<InvoiceAutoSetting>);
                } else {
                    addInvoiceAutoSetting({
                        ...result.data,
                        merchantId,
                    } as InvoiceAutoSetting);
                }
                router.push("/dashboard/merchant/invoice-auto");
            } else {
                toast.error(result.message || "Operation failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule Details</CardTitle>
                                <CardDescription>Basic information about the auto-issuance schedule.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="scheduleName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Schedule Name <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Monthly Hosting" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="direction"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Direction <span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select direction" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="receivable">Receivable (Income)</SelectItem>
                                                        <SelectItem value="payable">Payable (Expense)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="clientId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Target Client <span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a client" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {clients.map((client) => (
                                                            <SelectItem key={client.id} value={client.id}>
                                                                {client.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="templateId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Invoice Template <span className="text-red-500">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a template" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {templates.map((template) => (
                                                        <SelectItem key={template.id} value={template.id}>
                                                            {template.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                The template defines the items and layout of the generated invoice.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Enabled</FormLabel>
                                                <FormDescription>
                                                    Enable or disable this auto-issuance schedule.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Frequency & Timing</CardTitle>
                                <CardDescription>Configure when and how often invoices are generated.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="intervalValue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Frequency Value <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="number" min={1} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="intervalType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Frequency Type <span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="daily">Daily</SelectItem>
                                                        <SelectItem value="weekly">Weekly</SelectItem>
                                                        <SelectItem value="monthly">Monthly</SelectItem>
                                                        <SelectItem value="yearly">Yearly</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Date (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : (setting ? "Update Schedule" : "Create Schedule")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
