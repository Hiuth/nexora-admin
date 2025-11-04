# Dashboard Components

## Cấu trúc thành phần

Dashboard đã được tái cấu trúc thành các components nhỏ để dễ quản lý và tái sử dụng:

### 📁 Components

#### `dashboard-overview.tsx`

- **Mục đích**: Component chính điều phối toàn bộ dashboard
- **Chức năng**: Sử dụng custom hook để load data và render các sub-components
- **Props**: Không có props, self-contained

#### `hero-section.tsx`

- **Mục đích**: Section chào mừng với gradient background
- **Chức năng**: Hiển thị tiêu đề, mô tả và ngày tháng hiện tại
- **Props**: Không có props, static content

#### `stats-cards.tsx`

- **Mục đích**: Grid các thẻ thống kê với gradient và animations
- **Chức năng**: Hiển thị metrics quan trọng (sản phẩm, đơn hàng, PC builds, etc.)
- **Props**: `stats` object chứa các con số thống kê

#### `recent-orders.tsx`

- **Mục đích**: Danh sách đơn hàng gần đây
- **Chức năng**: Hiển thị 5 đơn hàng mới nhất với thông tin khách hàng và giá trị
- **Props**: `orders` array chứa data đơn hàng

#### `quick-actions.tsx`

- **Mục đích**: Các nút thao tác nhanh
- **Chức năng**: Shortcuts tới các chức năng quan trọng
- **Props**: Không có props, static actions

#### `top-products.tsx`

- **Mục đích**: Danh sách sản phẩm nổi bật
- **Chức năng**: Hiển thị 3 sản phẩm đầu tiên với hình ảnh và giá
- **Props**: `products` array chứa data sản phẩm

#### `loading-skeleton.tsx`

- **Mục đích**: Loading state với animated skeletons
- **Chức năng**: Hiển thị placeholder khi đang tải data
- **Props**: Không có props, pure UI

### 🎣 Custom Hook

#### `use-dashboard-data.ts`

- **Mục đích**: Quản lý state và logic load data cho dashboard
- **Chức năng**:
  - Load data từ multiple APIs
  - Manage loading states
  - Error handling
  - Provide refetch function
- **Returns**: `{ stats, loading, error, refetch }`

### 📦 Export Structure

```typescript
// components/dashboard/index.ts
export { HeroSection } from "./hero-section";
export { StatsCards } from "./stats-cards";
export { RecentOrders } from "./recent-orders";
export { QuickActions } from "./quick-actions";
export { TopProducts } from "./top-products";
export { LoadingSkeleton } from "./loading-skeleton";
```

## Ưu điểm của cấu trúc mới

### 🔧 **Maintainability**

- Mỗi component có trách nhiệm rõ ràng
- Dễ debug và modify từng phần riêng biệt
- Code reusable và modular

### 🚀 **Performance**

- Lazy loading có thể implement cho từng component
- Re-render optimization dễ dàng hơn
- Bundle splitting hiệu quả

### 🎨 **Development Experience**

- Easy to test individual components
- Clear separation of concerns
- Type safety với TypeScript
- Consistent prop interfaces

### 🔄 **Reusability**

- Components có thể sử dụng ở pages khác
- Consistent design system
- Easy to extend và customize

## Usage Example

```typescript
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function HomePage() {
  return <DashboardOverview />;
}

// Hoặc sử dụng individual components
import { StatsCards, RecentOrders } from "@/components/dashboard";

export default function CustomDashboard() {
  const { stats } = useDashboardData();

  return (
    <div>
      <StatsCards stats={stats} />
      <RecentOrders orders={stats.recentOrders} />
    </div>
  );
}
```

## Styling & Theming

- Sử dụng Tailwind CSS với utility classes
- Gradient backgrounds và glassmorphism effects
- Consistent color palette
- Responsive design với grid systems
- Hover animations và transitions
