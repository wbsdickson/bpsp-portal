import { useAppStore } from "@/lib/store";
import { useState, useEffect } from "react";
import type { User } from "@/lib/types";

interface AccountFormProps {
  account?: User;
  onSuccess?: () => void;
}

export function AccountForm({ account, onSuccess }: AccountFormProps) {
  const { updateAccount, getAccounts } = useAppStore();
  const [name, setName] = useState(account?.name || "");
  const [email, setEmail] = useState(account?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(account?.name || "");
    setEmail(account?.email || "");
    setPassword("");
    setConfirmPassword("");
    setSuccess("");
    setError("");
  }, [account]);

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
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("A valid email is required.");
      setLoading(false);
      return;
    }
    const exists = getAccounts().some(
      (u) => u.email === email && u.id !== account?.id && (!u.deletedAt)
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
      if (!account) throw new Error("No account to update");
      updateAccount(account.id, {
        name,
        email,
        ...(password ? { password_hash: `hashed_${password}` } : {}),
      });
      setSuccess("Account information has been updated.");
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
      <h2 className="text-2xl font-bold mb-4">Account Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
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
          <label htmlFor="email" className="block mb-1 font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            autoComplete="new-password"
            placeholder="Leave blank to keep current password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            autoComplete="new-password"
            placeholder="Leave blank to keep current password"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : account?.id ? "Update Account" : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
