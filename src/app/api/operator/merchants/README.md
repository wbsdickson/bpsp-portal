# Operator Merchants API

A mock API endpoint for fetching merchant data with filtering, pagination, and sorting capabilities.

## Endpoint

```
GET /api/operator/merchants
```

## Features

- ✅ **Strong TypeScript typing** - Full type safety with Zod validation
- ✅ **Query parameter validation** - Automatic validation and error handling
- ✅ **Pagination** - Page-based pagination with configurable limits
- ✅ **Filtering** - Filter by status and search term
- ✅ **Sorting** - Sort by name, createdAt, or transactionCount
- ✅ **Error handling** - Comprehensive error responses with proper HTTP status codes

## Query Parameters

| Parameter   | Type                                          | Default  | Description                       |
| ----------- | --------------------------------------------- | -------- | --------------------------------- |
| `page`      | number                                        | `1`      | Page number (must be positive)    |
| `limit`     | number                                        | `10`     | Items per page (max: 100)         |
| `status`    | `"active" \| "suspended"`                     | -        | Filter by merchant status         |
| `search`    | string                                        | -        | Search in name, email, or address |
| `sortBy`    | `"name" \| "createdAt" \| "transactionCount"` | `"name"` | Field to sort by                  |
| `sortOrder` | `"asc" \| "desc"`                             | `"asc"`  | Sort direction                    |

## Response Format

### Success Response (200)

```typescript
{
  data: AppMerchant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    filters?: {
      status?: MerchantStatus;
      search?: string;
    };
  };
}
```

### Error Response (400/500)

```typescript
{
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

## Usage Examples

### Basic Request

```bash
GET /api/operator/merchants
```

### With Pagination

```bash
GET /api/operator/merchants?page=2&limit=20
```

### Filter by Status

```bash
GET /api/operator/merchants?status=active
```

### Search Merchants

```bash
GET /api/operator/merchants?search=TechCorp
```

### Sort Results

```bash
GET /api/operator/merchants?sortBy=createdAt&sortOrder=desc
```

### Combined Filters

```bash
GET /api/operator/merchants?status=active&search=Tech&page=1&limit=10&sortBy=name&sortOrder=asc
```

## Example Response

```json
{
  "data": [
    {
      "id": "u1",
      "name": "TechCorp Solutions",
      "address": "123 Tech Blvd, San Francisco, CA 94105",
      "phoneNumber": "555-0101",
      "invoiceEmail": "billing@techcorp.com",
      "websiteUrl": "https://techcorp.com",
      "invoicePrefix": "TC-",
      "enableCreditPayment": true,
      "defaultTaxId": "tax_10",
      "createdAt": "2023-11-26T09:00:00Z",
      "status": "active",
      "transactionCount": 150
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  },
  "meta": {
    "filters": {
      "status": "active"
    }
  }
}
```

## Error Codes

- `INVALID_QUERY_PARAMETERS` (400) - Invalid query parameter values
- `INTERNAL_SERVER_ERROR` (500) - Unexpected server error

## Testing

The API can be tested using:

1. **Browser/Postman**: Direct HTTP requests
2. **cURL**:
   ```bash
   curl http://localhost:3000/api/operator/merchants?page=1&limit=10
   ```
3. **TypeScript/JavaScript**:
   ```typescript
   const response = await fetch('/api/operator/merchants?page=1&limit=10');
   const data = await response.json();
   ```

## Type Safety

All types are exported and can be imported:

```typescript
import type { AppMerchant, MerchantStatus } from "@/types/merchant";
```

The API uses Zod schemas for runtime validation, ensuring type safety at both compile-time and runtime.
