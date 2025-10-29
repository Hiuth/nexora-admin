"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import AdminLayout from "@/components/admin-layout";

interface PcBuild {
  id: string;
  name: string;
  sku: string;
  components: number;
  status: "active" | "inactive";
  price: number;
}

const mockPcBuilds: PcBuild[] = [
  {
    id: "1",
    name: "Gaming PC RTX 4080",
    sku: "PC-GAMING-4080",
    components: 8,
    status: "active",
    price: 2999,
  },
  {
    id: "2",
    name: "Office PC Basic",
    sku: "PC-OFFICE-BASIC",
    components: 6,
    status: "active",
    price: 899,
  },
  {
    id: "3",
    name: "Workstation Intel i9",
    sku: "PC-WORK-I9",
    components: 12,
    status: "inactive",
    price: 3599,
  },
];

export default function ConfigurableProductsPage() {
  const [products, setProducts] = useState(mockPcBuilds);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Máy Tính Xây Sẵn
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý các máy tính được lắp ráp sẵn
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={20} />
            Thêm máy tính xây sẵn
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Tên máy tính
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Số linh kiện
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Trạng thái
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
                  <td className="px-6 py-4 text-foreground font-medium">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {product.components}
                  </td>
                  <td className="px-6 py-4 text-foreground font-semibold">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {product.status === "active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
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
