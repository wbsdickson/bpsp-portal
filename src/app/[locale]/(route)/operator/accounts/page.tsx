"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableDemo } from "./demo";

export default function AccountsPage() {
  const rows = [
    {
      id: "acc_001",
      name: "JPCC Main Account",
      type: "Business",
      status: "Active",
      currency: "JPY",
    },
    {
      id: "acc_002",
      name: "Sandbox Account",
      type: "Test",
      status: "Inactive",
      currency: "USD",
    },
  ];

  return (
    <div className="p-6">
      <div className="text-lg font-semibold">Accounts</div>

      <div className="mt-4 rounded-xl border bg-background p-5">
        {/* <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Account ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell className="text-right">{row.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
        <DataTableDemo />
      </div>
    </div>
  );
}
