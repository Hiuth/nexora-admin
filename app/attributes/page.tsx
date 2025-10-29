"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";

interface Attribute {
  id: string;
  name: string;
  type: string;
  values: number;
}

const mockAttributes: Attribute[] = [
  { id: "1", name: "Màu sắc", type: "select", values: 12 },
  { id: "2", name: "Kích thước", type: "select", values: 8 },
  { id: "3", name: "Chất liệu", type: "text", values: 15 },
];

export default function AttributesPage() {
  const [attributes, setAttributes] = useState(mockAttributes);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý thuộc tính
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý các thuộc tính sản phẩm
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={20} />
            Thêm thuộc tính
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Tên thuộc tính
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Loại
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Số giá trị
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr
                  key={attr.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-foreground">{attr.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {attr.type}
                  </td>
                  <td className="px-6 py-4 text-foreground">{attr.values}</td>
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
