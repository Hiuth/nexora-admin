"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";

interface Brand {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

const mockBrands: Brand[] = [
  { id: "1", name: "Samsung", slug: "samsung", productCount: 45 },
  { id: "2", name: "Apple", slug: "apple", productCount: 67 },
  { id: "3", name: "Sony", slug: "sony", productCount: 34 },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState(mockBrands);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý thương hiệu
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý các thương hiệu sản phẩm
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={20} />
            Thêm thương hiệu
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Tên thương hiệu
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Slug
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
              {brands.map((brand) => (
                <tr
                  key={brand.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-foreground">{brand.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {brand.slug}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {brand.productCount}
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
