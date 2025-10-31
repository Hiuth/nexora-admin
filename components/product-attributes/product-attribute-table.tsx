"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProductAttributeWithDetails } from "@/hooks/use-product-attributes";

interface ProductAttributeTableProps {
  productAttributes: ProductAttributeWithDetails[];
  onEdit: (productAttribute: ProductAttributeWithDetails) => void;
  onDelete: (productAttributeId: string) => Promise<boolean>;
  loading?: boolean;
  deleting?: string | null;
  selectedProductId?: string;
}

export function ProductAttributeTable({
  productAttributes,
  onEdit,
  onDelete,
  loading = false,
  deleting = null,
  selectedProductId,
}: ProductAttributeTableProps) {
  if (!selectedProductId) {
    return (
      <Card className="border-border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-muted-foreground">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-sm font-medium mb-1">Chọn sản phẩm</h3>
            <p className="text-sm">
              Vui lòng chọn một sản phẩm để xem thuộc tính
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-border">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Đang tải...</span>
          </div>
        </div>
      </Card>
    );
  }

  if (productAttributes.length === 0) {
    return (
      <Card className="border-border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-muted-foreground">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="text-sm font-medium mb-1">Chưa có thuộc tính</h3>
            <p className="text-sm">Sản phẩm này chưa có thuộc tính nào</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Thuộc tính
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Giá trị
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                ID
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {productAttributes.map((productAttribute) => (
              <tr
                key={productAttribute.id}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">
                    {productAttribute.attributeName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="text-sm">
                    {productAttribute.value}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {productAttribute.id}
                  </code>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(productAttribute)}
                      className="text-primary hover:bg-primary/10"
                      disabled={!!deleting}
                    >
                      <Edit2 size={16} />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          disabled={!!deleting}
                        >
                          {deleting === productAttribute.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa thuộc tính "
                            {productAttribute.attributeName}" với giá trị "
                            {productAttribute.value}"? Hành động này không thể
                            hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(productAttribute.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
