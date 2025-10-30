# API Configuration Guide

## Cấu hình API trung tâm

Dự án đã được cập nhật để sử dụng cấu hình API trung tâm thông qua file `lib/api-config.ts`.

### Cấu trúc file api-config.ts

```typescript
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7071/api",
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: "/Auth/login",
    LOGOUT: "/Auth/logout",
    // ... other endpoints
  },
};
```

### Cách sử dụng

1. **Import cấu hình:**

```typescript
import { API_CONFIG, buildApiUrl } from "@/lib/api-config";
```

2. **Sử dụng endpoints:**

```typescript
// Thay vì hardcode
fetch("/Auth/login");

// Sử dụng config
fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN));
```

### Environment Variables

Tạo file `.env.local` với nội dung:

````
### Environment Variables

1. **Copy file template:**
```bash
cp .env.example .env.local
````

2. **Cấu hình trong `.env.local`:**

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://localhost:7098/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=Nexora Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

3. **Cho production, thay đổi API URL:**

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com/api
```

```

### Files đã được cập nhật

- ✅ `lib/api-config.ts` - File cấu hình trung tâm
- ✅ `lib/auth.ts` - Authentication service
- ✅ `components/auth-provider.tsx` - Auth context
- ✅ `lib/api/base.ts` - Base API utilities
- ✅ `lib/api/category.ts` - Category service
- ✅ `lib/api/brand.ts` - Brand service
- ✅ `lib/api/product.ts` - Product service (partial)
- ✅ `lib/api/order.ts` - Order service

### Lợi ích

1. **Duy trì dễ dàng:** Chỉ cần thay đổi URL ở một nơi
2. **Type Safety:** TypeScript hỗ trợ autocomplete cho endpoints
3. **Environment Support:** Dễ dàng chuyển đổi giữa dev/staging/production
4. **Consistency:** Đảm bảo tất cả API calls đều sử dụng cùng base URL
```
