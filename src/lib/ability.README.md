# CASL Permission System

This project uses [CASL](https://casl.js.org/) (cals) for role and permission management.

## Installation

```bash
bun add @casl/ability @casl/react
```

## Architecture

### Core Files

- `src/lib/ability.ts` - Ability definitions and rules
- `src/context/ability-context.tsx` - React context provider and hooks
- `src/components/can.tsx` - Permission-based conditional rendering component
- `src/hooks/use-permissions.ts` - Convenience hooks for common permission checks
- `src/lib/permissions.ts` - Server-side permission utilities

## Usage Examples

### Client Components

#### Using `useCan()` hook:
```typescript
"use client";

import { useCan } from "@/context/ability-context";

export function InvoiceActions() {
  const { can } = useCan();

  return (
    <div>
      {can("create", "Invoice") && (
        <Button>Create Invoice</Button>
      )}
      {can("delete", "Invoice") && (
        <Button variant="destructive">Delete</Button>
      )}
    </div>
  );
}
```

#### Using `<Can>` component:
```typescript
"use client";

import { Can } from "@/components/can";

export function InvoiceActions() {
  return (
    <div>
      <Can I="create" a="Invoice">
        <Button>Create Invoice</Button>
      </Can>
      <Can I="delete" a="Invoice" fallback={<p>No permission</p>}>
        <Button variant="destructive">Delete</Button>
      </Can>
    </div>
  );
}
```

#### Using `usePermissions()` hook:
```typescript
"use client";

import { usePermissions } from "@/hooks/use-permissions";

export function InvoiceActions() {
  const { canCreateInvoice, canDeleteInvoice } = usePermissions();

  return (
    <div>
      {canCreateInvoice() && <Button>Create Invoice</Button>}
      {canDeleteInvoice() && <Button variant="destructive">Delete</Button>}
    </div>
  );
}
```

### Server Components / API Routes

```typescript
import { checkPermission, requirePermission } from "@/lib/permissions";
import { auth } from "@/auth";

export default async function InvoicePage() {
  const session = await auth();
  const user = session?.user as AppUser | null;
  const memberRole = (session?.user as any)?.memberRole;

  // Check permission
  if (!checkPermission(user, "read", "Invoice", memberRole)) {
    redirect("/unauthorized");
  }

  // Or throw error
  requirePermission(user, "read", "Invoice", memberRole);

  return <div>Invoice content</div>;
}
```

## Role Permissions

### Backoffice Roles
- `backoffice_admin`: Full access to everything including User and Merchant management
- `backoffice_staff`: Can read and update most resources but cannot delete or manage users/merchants

### Merchant Roles
- `merchant_owner`: Full access to merchant functions including Account management
- `merchant_admin`: Can use BPSP functions (create, update) but cannot delete critical items or manage settings
- `merchant_viewer`: Read-only access to BPSP functions

## Adding New Permissions

1. Add new subject to `Subjects` type in `src/lib/ability.ts`
2. Add permission rules in `src/lib/ability-config.json` for the relevant role(s)
3. Add convenience methods to `usePermissions()` hook if needed

### JSON Configuration Structure

The permissions are defined in `src/lib/ability-config.json` with the following structure:

```json
{
  "roles": {
    "role_name": {
      "permissions": [
        { "action": "read", "subject": "Invoice" },
        { "action": "create", "subject": "Invoice" }
      ],
      "restrictions": [
        { "action": "delete", "subject": "Invoice" }
      ]
    }
  }
}
```

- **permissions**: Array of allowed actions on subjects
- **restrictions**: Array of denied actions on subjects (takes precedence over permissions)

## Best Practices

1. **Never use direct role checks** - Always use CASL abilities
2. **Use `<Can>` component** for UI-level permission checks
3. **Use `usePermissions()` hook** for common permission patterns
4. **Use server-side checks** in API routes and Server Components
5. **Keep ability definitions centralized** in `src/lib/ability.ts`
