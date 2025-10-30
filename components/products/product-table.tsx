"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";
import { ProductResponse } from "@/types";

interface ProductTableProps {
  products: ProductResponse[];
  onEdit: (product: ProductResponse) => void;
  onDelete: (productId: string) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const getStatusColor = (status: string) => {
    return status === "ACTIVE" ? "text-green-500" : "text-red-500";
  };

  const getStockColor = (stock: number) => {
    if (stock > 50) return "text-green-500";
    if (stock > 10) return "text-yellow-500";
    return "text-red-500";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card className="border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Tên sản phẩm
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Thương hiệu
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Danh mục con
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Giá
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Tồn kho
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
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
                <td className="px-6 py-4 text-sm text-foreground font-medium">
                  {product.productName}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {product.brandName}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {product.subCategoryName}
                </td>
                <td className="px-6 py-4 text-sm text-foreground font-medium">
                  {formatPrice(product.price)}
                </td>
                <td
                  className={`px-6 py-4 text-sm font-medium ${getStockColor(
                    product.stockQuantity
                  )}`}
                >
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stockQuantity > 10
                        ? "bg-green-500/20 text-green-400"
                        : product.stockQuantity > 0
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {product.stockQuantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {product.status === "ACTIVE"
                      ? "Hoạt động"
                      : "Ngưng hoạt động"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
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
