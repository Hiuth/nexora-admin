"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: string;
  productCount: number;
}

const mockCategories: Category[] = [
  { id: "1", name: "Electronics", slug: "electronics", productCount: 234 },
  { id: "2", name: "Clothing", slug: "clothing", productCount: 567 },
  { id: "3", name: "Home & Garden", slug: "home-garden", productCount: 123 },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý danh mục
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý danh mục cha và danh mục con
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={20} />
            Thêm danh mục
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Tên danh mục
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Danh mục cha
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Số sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-foreground">{category.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {category.parent || "-"}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {category.productCount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-background rounded transition-colors">
                        <Edit2 size={18} className="text-foreground" />
                      </button>
                      <button className="p-2 hover:bg-background rounded transition-colors">
                        <Trash2 size={18} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
