"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Package } from "lucide-react";
import { PcBuildItemResponse } from "@/types";
import { PcBuildItemDialog } from "@/components/pc-build-items/pc-build-item-dialog";
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

interface PcBuildItemTableProps {
  pcBuildItems: PcBuildItemResponse[];
  pcBuildId: string;
  pcBuildName: string;
  selectedCategoryId: string;
  onRefresh: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function PcBuildItemTable({
  pcBuildItems,
  pcBuildId,
  pcBuildName,
  selectedCategoryId,
  onRefresh,
  onDelete,
}: PcBuildItemTableProps) {
  const [editingItem, setEditingItem] = useState<PcBuildItemResponse | null>(
    null
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleEdit = (item: PcBuildItemResponse) => {
    setEditingItem(item);
  };

  const handleCloseDialog = () => {
    setEditingItem(null);
    setShowCreateDialog(false);
    onRefresh();
  };

  const totalPrice = pcBuildItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">
            Linh Kiện Cấu Hình: {pcBuildName}
          </h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các linh kiện trong cấu hình máy tính này (
            {pcBuildItems.length} linh kiện)
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          disabled={!selectedCategoryId}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Linh Kiện
        </Button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Tổng Linh Kiện</p>
              <p className="text-xl font-bold text-blue-700">
                {pcBuildItems.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-green-600">Tổng Số Lượng</p>
              <p className="text-xl font-bold text-green-700">
                {pcBuildItems.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600">Tổng Giá Trị</p>
              <p className="text-xl font-bold text-purple-700">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình Ảnh</TableHead>
              <TableHead>Tên Sản Phẩm</TableHead>
              <TableHead>Số Lượng</TableHead>
              <TableHead>Đơn Giá</TableHead>
              <TableHead>Thành Tiền</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pcBuildItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                    <p>Chưa có linh kiện nào trong cấu hình này</p>
                    <p className="text-sm">Hãy thêm linh kiện để bắt đầu</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pcBuildItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.productName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {item.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price * item.quantity)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa Linh Kiện</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa linh kiện "
                            {item.productName}" khỏi cấu hình này không? Hành
                            động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(item.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <PcBuildItemDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        pcBuildId={pcBuildId}
        selectedCategoryId={selectedCategoryId}
        onSuccess={handleCloseDialog}
      />

      {/* Edit Dialog */}
      <PcBuildItemDialog
        open={!!editingItem}
        onOpenChange={(open: boolean) => !open && setEditingItem(null)}
        pcBuildId={pcBuildId}
        selectedCategoryId={selectedCategoryId}
        pcBuildItem={editingItem}
        onSuccess={handleCloseDialog}
      />
    </div>
  );
}
