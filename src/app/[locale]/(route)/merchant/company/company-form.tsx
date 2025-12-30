import { useAppStore } from "@/lib/store";
import { useState, useEffect } from "react";
import type { Company } from "@/lib/types";

interface CompanyFormProps {
  company?: Company;
  onSuccess?: () => void;
}

export function CompanyForm({ company, onSuccess }: CompanyFormProps) {
  const { updateCompany, getCompanies } = useAppStore();
  const [name, setName] = useState(company?.name || "");
  const [invoiceEmail, setInvoiceEmail] = useState(company?.invoiceEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(company?.name || "");
    setInvoiceEmail(company?.invoiceEmail || "");
    setPassword("");
    setConfirmPassword("");
    setSuccess("");
    setError("");
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }
    if (!invoiceEmail.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(invoiceEmail)) {
      setError("A valid email is required.");
      setLoading(false);
      return;
    }
    const exists = getCompanies().some(
      (c) => c.invoiceEmail === invoiceEmail && c.id !== company?.id && (!c.deletedAt)
    );
    if (exists) {
      setError("This email address is already in use.");
      setLoading(false);
      return;
    }
    if (password && password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      if (!company) throw new Error("No company to update");
      updateCompany(company.id, {
        name,
        address: company?.address || "",
        phoneNumber: company?.phoneNumber || "",
        invoiceEmail,
        websiteUrl: company?.websiteUrl || "",
        invoicePrefix: company?.invoicePrefix || "",
        enableCreditPayment: company?.enableCreditPayment || false,
      });
      setSuccess("Company information has been updated.");
      setPassword("");
      setConfirmPassword("");
      if (onSuccess) onSuccess();
    } catch {
      setError("Failed to update account. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mt-8 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Company Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Merchant Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="address" className="block mb-1 font-medium">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={company?.address || ""}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block mb-1 font-medium">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={company?.phoneNumber || ""}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
           Invoice Email 
          </label>
          <input
            type="email"
            id="invoiceEmail"
            value={company?.invoiceEmail || ""}
            onChange={(e) => setInvoiceEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="websiteUrl" className="block mb-1 font-medium">
            Website URL
          </label>
          <input
            type="text"
            id="websiteUrl"
            value={company?.websiteUrl || ""}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="invoicePrefix" className="block mb-1 font-medium">
            Invoice Prefix
          </label>
          <input
            type="text"
            id="invoicePrefix"
            value={company?.invoicePrefix || ""}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="enableCreditPayment" className="block mb-1 font-medium">
            Enable Credit Payment
          </label>
          <input
            className="w-4 h-4"
            type="checkbox"
            id="enableCreditPayment"
            checked={company?.enableCreditPayment || false}
            onChange={(e) => updateCompany(company?.id || "", { enableCreditPayment: !company?.enableCreditPayment })}
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : company?.id ? "Update Company" : "Create Company"}
          </button>
        </div>
      </form>
    </div>
  );
}
