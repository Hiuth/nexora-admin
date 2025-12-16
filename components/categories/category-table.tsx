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
}

export function CategoryTable({
  categories,
  onEdit,
}: CategoryTableProps) {
  return (
    <>
      {/* Desktop View (md and above) */}
      <div className="hidden md:block">
        <Card className="border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Tên danh mục
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Icon
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
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
                    <td className="px-4 py-3 text-sm text-foreground font-medium">
                      <div
                        className="max-w-[200px] truncate"
                        title={category.categoryName}
                      >
                        {category.categoryName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {category.iconImg ? (
                        <img
                          src={category.iconImg}
                          alt={category.categoryName}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(category)}
                          className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View (below md) */}
      <div className="block md:hidden space-y-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Card
              key={category.id}
              className="border-border hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {category.iconImg ? (
                      <img
                        src={category.iconImg}
                        alt={category.categoryName}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-muted-foreground">
                          No Img
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm leading-tight">
                        {category.categoryName}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(category)}
                      className="text-primary hover:bg-primary/10 h-8 w-8 p-0"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="border-border">
            <div className="p-8 text-center text-muted-foreground">
              Không có danh mục nào
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
