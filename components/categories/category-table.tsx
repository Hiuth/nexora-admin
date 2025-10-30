"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";

interface Category {
  id: string;
  categoryName: string;
  iconImg?: string;
  productCount?: number;
}

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <Card className="border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Tên danh mục
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Icon
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Số sản phẩm
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
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
                <td className="px-6 py-4 text-sm text-foreground font-medium">
                  {category.categoryName}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {category.iconImg ? (
                    <img
                      src={category.iconImg}
                      alt={category.categoryName}
                      className="w-8 h-8 rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {category.productCount || 0}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(category)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(category.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
