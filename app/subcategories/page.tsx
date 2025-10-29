import AdminLayout from "@/components/admin-layout";
import { SubCategoryTable } from "@/components/categories/subcategory-table";

export default function SubCategoriesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản Lý Danh Mục Con
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các danh mục con sản phẩm
          </p>
        </div>
        <SubCategoryTable />
      </div>
    </AdminLayout>
  );
}
