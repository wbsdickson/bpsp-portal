"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/date-utils";

import type { BankAccount, Client, Item, Merchant, Tax } from "@/lib/types";
import type { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { z } from "zod";

type LineItem = {
  id: string;
  itemId?: string;
  description: string;
  transactionDate?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  taxId?: string;
  withholdingTax?: boolean;
};

const lineItemFormSchema = z.object({
  itemId: z.string().optional(),
  description: z.string().optional(),
  transactionDate: z.string().optional(),
  quantity: z.number().min(1),
  unit: z.string().optional(),
  unitPrice: z.number().min(0),
  taxId: z.string().optional(),
  withholdingTax: z.boolean().optional(),
});

const invoiceUpsertFormSchema = z.object({
  merchantId: z.string().min(1),
  clientId: z.string().min(1),
  honorific: z.string().optional(),
  invoiceDate: z.string().min(1),
  dueDate: z.string().optional(),
  subject: z.string().optional(),
  amount: z.number().min(0),
  currency: z.string().min(1),
  updatedAt: z.string().optional(),
  invoiceNumber: z.string().min(1),
  items: z.array(lineItemFormSchema).min(1),
  bankAccountId: z.string().optional(),
  remark: z.string().optional(),
});

type InvoiceUpsertFormValues = z.infer<typeof invoiceUpsertFormSchema>;

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

type CreateInvoiceFormProps = {
  form: UseFormReturn<InvoiceUpsertFormValues>;
  merchants: Merchant[];
  availableCustomers: Client[];
  availableItems: Item[];
  taxes: Tax[];
  bankAccounts: BankAccount[];
  selectedMerchant: Merchant | null;
  subtotal: number;
  itemFields: FieldArrayWithId<InvoiceUpsertFormValues, "items", "id">[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
};

export default function CreateInvoiceForm({
  form,
  merchants,
  availableCustomers,
  availableItems,
  taxes,
  bankAccounts,
  selectedMerchant,
  subtotal,
  itemFields,
  onAddItem,
  onRemoveItem,
}: CreateInvoiceFormProps) {
  const t = useTranslations("Operator.Invoice");

  const currency = useWatch({ control: form.control, name: "currency" });
  const taxRateById = React.useMemo(() => {
    const map = new Map<string, number>();
    taxes.forEach((t) => map.set(t.id, t.rate ?? 0));
    return map;
  }, [taxes]);

  return (
    <ScrollArea className="h-[calc(100vh-120px)] p-4">
      <div className="space-y-8">
        {/* 請求情報 (Invoice Information) */}
        <section className="space-y-4">
          <div className="text-sm font-semibold">
            {t("upsert.sections.invoiceInfo")}
          </div>

          {/* 取引先 (Client) + 敬称 (Honorific) row */}
          <div className="flex items-start gap-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="max-w-sm flex-1">
                  <div className="text-muted-foreground mb-1 text-xs">
                    {t("upsert.fields.client")}
                  </div>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue
                          placeholder={t("upsert.fields.selectClient")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCustomers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="honorific"
              render={({ field }) => (
                <FormItem className="w-[120px]">
                  <div className="text-muted-foreground mb-1 text-xs">
                    {t("upsert.fields.honorific")}
                  </div>
                  <Select
                    value={field.value ?? t("upsert.honorifics.gochu")}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={t("upsert.honorifics.gochu")}>
                        {t("upsert.honorifics.gochu")}
                      </SelectItem>
                      <SelectItem value={t("upsert.honorifics.sama")}>
                        {t("upsert.honorifics.sama")}
                      </SelectItem>
                      <SelectItem value={t("upsert.honorifics.dono")}>
                        {t("upsert.honorifics.dono")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 請求書番号 (Invoice Number) */}
          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem className="max-w-sm">
                <div className="text-muted-foreground mb-1 text-xs">
                  {t("upsert.fields.invoiceNumber")}
                </div>
                <FormControl>
                  <Input {...field} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 発行日 (Issue Date) */}
          <div className="flex items-start gap-4">
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem className="max-w-[180px]">
                  <div className="text-muted-foreground mb-1 text-xs">
                    {t("upsert.fields.issueDate")}
                  </div>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(formatDate(date?.toISOString() ?? ""))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 期日 (Due Date) */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="max-w-[180px]">
                  <div className="text-muted-foreground mb-1 text-xs">
                    {t("upsert.fields.dueDate")}
                  </div>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(formatDate(date?.toISOString() ?? ""))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 件名 (Subject) */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="max-w-sm">
                <div className="text-muted-foreground mb-1 text-xs">
                  {t("upsert.fields.subject")}
                </div>
                <FormControl>
                  <Input {...field} className="h-9" placeholder="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* 請求元情報 (Merchant Source Info) */}
        <section className="space-y-3">
          <div className="text-sm font-semibold">
            {t("upsert.sections.merchantSourceInfo")}
          </div>
          {selectedMerchant && (
            <div className="flex items-start justify-between">
              <div className="space-y-1 text-sm">
                <div>{selectedMerchant.name}</div>
                {selectedMerchant.address && (
                  <div className="text-muted-foreground">
                    {selectedMerchant.address}
                  </div>
                )}
                {selectedMerchant.phoneNumber && (
                  <div className="text-muted-foreground">
                    TEL: {selectedMerchant.phoneNumber}
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <Pencil className="mr-1 h-3 w-3" />
                {t("upsert.fields.editMerchantInfo")}
              </Button>
            </div>
          )}
        </section>

        {/* 明細 (Line Items) */}
        <section className="space-y-3">
          <div className="text-sm font-semibold">
            {t("upsert.sections.lineItems")}
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-background overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[400px] px-2">
                      {t("upsert.table.itemName")}
                    </TableHead>
                    <TableHead className="w-[110px] px-2">
                      {t("upsert.table.transactionDate")}
                    </TableHead>
                    <TableHead className="w-[60px] px-2 text-center">
                      {t("upsert.table.qty")}
                    </TableHead>
                    <TableHead className="w-[70px] px-2">
                      {t("upsert.table.unit")}
                    </TableHead>
                    <TableHead className="w-[90px] px-2 text-right">
                      {t("upsert.table.unitPrice")}
                    </TableHead>
                    <TableHead className="w-[100px] px-2">
                      {t("upsert.table.taxCategory")}
                    </TableHead>
                    <TableHead className="w-[50px] px-2">
                      {t("upsert.table.withholdingTax")}
                    </TableHead>
                    <TableHead className="w-[80px] px-2 text-right">
                      {t("upsert.table.amount")}
                    </TableHead>
                    <TableHead className="w-[40px] px-2"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemFields.map((row, index) => (
                    <TableRow key={row.id}>
                      {/* 品目名 (Item Name) */}
                      <TableCell className="px-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.itemId`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                value={field.value ?? ""}
                                onValueChange={(v) => {
                                  field.onChange(v);
                                  const selected = availableItems.find(
                                    (it) => it.id === v,
                                  );
                                  if (!selected) return;

                                  form.setValue(
                                    `items.${index}.description`,
                                    selected.name,
                                    { shouldDirty: true },
                                  );
                                  form.setValue(
                                    `items.${index}.taxId`,
                                    selected.taxId,
                                    { shouldDirty: true },
                                  );
                                  form.setValue(
                                    `items.${index}.unitPrice`,
                                    selected.unitPrice ?? 0,
                                    { shouldDirty: true },
                                  );
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-9 w-full">
                                    <SelectValue
                                      placeholder={t("upsert.table.selectItem")}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableItems.map((it) => (
                                    <SelectItem key={it.id} value={it.id}>
                                      {it.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* 取引日 (Transaction Date) */}
                      <TableCell className="px-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.transactionDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <DatePicker
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onChange={(date) =>
                                    field.onChange(
                                      formatDate(date?.toISOString() ?? ""),
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* 数量 (Quantity) */}
                      <TableCell className="px-2 text-center">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  value={String(field.value ?? 1)}
                                  onChange={(e) =>
                                    field.onChange(
                                      Math.max(1, Number(e.target.value || 1)),
                                    )
                                  }
                                  className="h-9 w-full text-center"
                                  inputMode="numeric"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* 単位 (Unit) */}
                      <TableCell className="px-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.unit`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-9 w-full">
                                    <SelectValue placeholder="-" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={t("upsert.units.piece")}>
                                    {t("upsert.units.piece")}
                                  </SelectItem>
                                  <SelectItem value={t("upsert.units.unit")}>
                                    {t("upsert.units.unit")}
                                  </SelectItem>
                                  <SelectItem value={t("upsert.units.sheet")}>
                                    {t("upsert.units.sheet")}
                                  </SelectItem>
                                  <SelectItem value={t("upsert.units.set")}>
                                    {t("upsert.units.set")}
                                  </SelectItem>
                                  <SelectItem value={t("upsert.units.hour")}>
                                    {t("upsert.units.hour")}
                                  </SelectItem>
                                  <SelectItem value={t("upsert.units.day")}>
                                    {t("upsert.units.day")}
                                  </SelectItem>
                                  <SelectItem value={t("upsert.units.month")}>
                                    {t("upsert.units.month")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* 単価 (Unit Price) */}
                      <TableCell className="px-2 text-right">
                        <FormField
                          control={form.control}
                          name={`items.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center gap-1">
                                  <Input
                                    value={String(field.value ?? 0)}
                                    onChange={(e) =>
                                      field.onChange(
                                        Number(e.target.value || 0),
                                      )
                                    }
                                    className="h-9 w-full text-right"
                                    inputMode="decimal"
                                  />
                                  <span className="text-muted-foreground text-md shrink-0">
                                    {t("upsert.currency.yen")}
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* 税区分 (Tax Category) */}
                      <TableCell className="px-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.taxId`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-9 w-full px-1">
                                    <SelectValue
                                      placeholder={t("upsert.table.selectTax")}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {taxes.map((tax) => (
                                    <SelectItem key={tax.id} value={tax.id}>
                                      {tax.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* 源泉徴収 (Withholding Tax) */}
                      <TableCell className="px-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.withholdingTax`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Checkbox
                                  checked={field.value ?? false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* 金額 (Amount) */}
                      <TableCell className="text-md whitespace-nowrap px-2 text-right font-medium">
                        {(() => {
                          const qty =
                            form.getValues(`items.${index}.quantity`) ?? 0;
                          const price =
                            form.getValues(`items.${index}.unitPrice`) ?? 0;
                          return `${(qty * price).toLocaleString()}${t("upsert.currency.yen")}`;
                        })()}
                      </TableCell>

                      {/* Delete button */}
                      <TableCell className="px-2 text-right">
                        <Button
                          
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                          onClick={() => onRemoveItem(index)}
                          disabled={itemFields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator />
              <div className="flex items-center justify-between gap-4 p-2">
                <Button
                  
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={onAddItem}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("upsert.addItem")}
                </Button>
                <div className="flex flex-col items-end gap-1 text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      {t("upsert.subtotal")}
                    </span>
                    <span className="font-medium">
                      {subtotal.toLocaleString()}
                      {t("upsert.currency.yen")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 振込先口座情報 (Bank Account Information) */}
        <section className="space-y-3">
          <div className="text-sm font-semibold">
            {t("upsert.sections.bankAccountInfo")}
          </div>
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[44px]"></TableHead>
                  <TableHead>{t("upsert.bankAccount.bankName")}</TableHead>
                  <TableHead>{t("upsert.bankAccount.branchName")}</TableHead>
                  <TableHead className="w-[80px]">
                    {t("upsert.bankAccount.accountType")}
                  </TableHead>
                  <TableHead>{t("upsert.bankAccount.accountNumber")}</TableHead>
                  <TableHead>{t("upsert.bankAccount.accountHolder")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-muted-foreground py-4 text-center"
                    >
                      {t("upsert.bankAccount.noAccounts")}
                    </TableCell>
                  </TableRow>
                ) : (
                  <FormField
                    control={form.control}
                    name="bankAccountId"
                    render={({ field }) => (
                      <>
                        {bankAccounts.map((account) => (
                          <TableRow
                            key={account.id}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => field.onChange(account.id)}
                          >
                            <TableCell>
                              <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <RadioGroupItem value={account.id} />
                              </RadioGroup>
                            </TableCell>
                            <TableCell>{account.bankName}</TableCell>
                            <TableCell>{account.branchName ?? "-"}</TableCell>
                            <TableCell>
                              {account.accountType === "savings"
                                ? t("upsert.bankAccount.savings")
                                : t("upsert.bankAccount.checking")}
                            </TableCell>
                            <TableCell>{account.accountNumber}</TableCell>
                            <TableCell>{account.accountHolder}</TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  />
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* 備考 (Remarks) */}
        <section className="space-y-3">
          <div className="text-sm font-semibold">
            {t("upsert.sections.remarks")}
          </div>
          <div >
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} placeholder="" className="min-h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="h-8" />
      </div>
    </ScrollArea>
  );
}
