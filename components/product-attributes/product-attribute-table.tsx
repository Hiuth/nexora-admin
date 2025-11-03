"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Loader2, Tag } from "lucide-react";
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
      <div className="text-center py-12 space-y-4">
        <Tag className="h-16 w-16 text-muted-foreground/50 mx-auto" />
        <div>
          <h3 className="text-lg font-medium">Chưa chọn sản phẩm</h3>
          <p className="text-muted-foreground">
            Vui lòng chọn một sản phẩm để xem thuộc tính
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Đang tải thuộc tính...</span>
        </div>
      </div>
    );
  }

  if (productAttributes.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Tag className="h-16 w-16 text-muted-foreground/50 mx-auto" />
        <div>
          <h3 className="text-lg font-medium">Chưa có thuộc tính</h3>
          <p className="text-muted-foreground">
            Sản phẩm này chưa có thuộc tính nào
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
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
          <tbody className="bg-background">
            {productAttributes.map((productAttribute, index) => (
              <tr
                key={productAttribute.id}
                className={`border-b border-border hover:bg-muted/30 transition-colors ${
                  index === productAttributes.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">
                    {productAttribute.attributeName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="text-sm font-medium">
                    {productAttribute.value}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
                    {productAttribute.id}
                  </code>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(productAttribute)}
                      className="text-primary hover:bg-primary/10 hover:text-primary"
                      disabled={!!deleting}
                      title="Chỉnh sửa thuộc tính"
                    >
                      <Edit2 size={16} />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={!!deleting}
                          title="Xóa thuộc tính"
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
    </div>
  );
}
