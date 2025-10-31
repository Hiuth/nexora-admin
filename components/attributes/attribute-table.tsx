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
import { AttributeWithCategory } from "@/hooks/use-attributes";

interface AttributeTableProps {
  attributes: AttributeWithCategory[];
  onEdit: (attribute: AttributeWithCategory) => void;
  onDelete: (attributeId: string) => Promise<boolean>;
  loading?: boolean;
  deleting?: string | null;
}

export function AttributeTable({
  attributes,
  onEdit,
  onDelete,
  loading = false,
  deleting = null,
}: AttributeTableProps) {
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

  if (attributes.length === 0) {
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
            <p className="text-sm">Bắt đầu bằng cách tạo thuộc tính đầu tiên</p>
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
                Tên thuộc tính
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Danh mục
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
            {attributes.map((attribute) => (
              <tr
                key={attribute.id}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">
                    {attribute.attributeName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="text-xs">
                    {attribute.categoryName || "Không xác định"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {attribute.id}
                  </code>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(attribute)}
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
                          {deleting === attribute.id ? (
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
                            {attribute.attributeName}"? Hành động này không thể
                            hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(attribute.id)}
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
