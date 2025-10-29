"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import AdminLayout from "@/components/admin-layout";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop Dell XPS 13",
    sku: "DELL-XPS-13",
    category: "Electronics",
    price: 999,
    stock: 15,
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    sku: "APPLE-IP15P",
    category: "Electronics",
    price: 1099,
    stock: 8,
  },
  {
    id: "3",
    name: "Samsung Galaxy S24",
    sku: "SAMSUNG-S24",
    category: "Electronics",
    price: 899,
    stock: 12,
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý sản phẩm
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý tất cả sản phẩm trong hệ thống
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={20} />
            Thêm sản phẩm
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Tồn kho
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-foreground">{product.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.stock > 10
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-background rounded transition-colors">
                        <Eye size={18} className="text-foreground" />
                      </button>
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
