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
import { Edit, Trash2, Plus } from "lucide-react";
import { ProductUnitResponse } from "@/types";
import { ProductUnitDialog } from "@/components/product-units/product-unit-dialog";
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

interface ProductUnitTableProps {
  productUnits: ProductUnitResponse[];
  productId: string;
  productName: string;
  stockQuantity: number;
  onRefresh: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function ProductUnitTable({
  productUnits,
  productId,
  productName,
  stockQuantity,
  onRefresh,
  onDelete,
}: ProductUnitTableProps) {
  // For serial products, we can always add more units (stockQuantity is just 0 placeholder)
  // For non-serial products, we check against stockQuantity
  const canAddMoreUnits = true; // Always allow adding units for serial products
  const [editingUnit, setEditingUnit] = useState<ProductUnitResponse | null>(
    null
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "AVAILABLE":
      case "CÓ SẴN":
        return "bg-green-500 text-white";
      case "SOLD":
      case "ĐÃ BÁN":
        return "bg-red-500 text-white";
      case "WARRANTY":
      case "ĐANG BẢO HÀNH":
        return "bg-blue-500 text-white";
      case "RESERVED":
      case "ĐÃ ĐẶT":
        return "bg-yellow-500 text-white";
      case "DAMAGED":
      case "HỎNG":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "AVAILABLE":
        return "Có sẵn";
      case "CÓ SẴN":
        return "Có sẵn";
      case "SOLD":
        return "Đã bán";
      case "ĐÃ BÁN":
        return "Đã bán";
      case "WARRANTY":
        return "Đang bảo hành";
      case "ĐANG BẢO HÀNH":
        return "Đang bảo hành";
      case "RESERVED":
        return "Đã đặt";
      case "ĐÃ ĐẶT":
        return "Đã đặt";
      case "DAMAGED":
        return "Hỏng";
      case "HỎNG":
        return "Hỏng";
      default:
        return status;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "Có Sẵn";
      case "sold":
        return "Đã Bán";
      case "reserved":
        return "Đã Đặt";
      case "damaged":
        return "Hỏng";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const handleEdit = (unit: ProductUnitResponse) => {
    setEditingUnit(unit);
  };

  const handleCloseDialog = () => {
    setEditingUnit(null);
    setShowCreateDialog(false);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">
            Đơn Vị Sản Phẩm: {productName}
          </h3>
          <p className="text-sm text-muted-foreground">
            Quản lý từng đơn vị cụ thể của sản phẩm này (Đã có{" "}
            {productUnits.length} đơn vị)
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm Đơn Vị
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Số Serial</TableHead>
              <TableHead>IMEI</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead>Ngày Tạo</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productUnits.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Chưa có đơn vị sản phẩm nào
                </TableCell>
              </TableRow>
            ) : (
              productUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">
                    {unit.serialNumber || "N/A"}
                  </TableCell>
                  <TableCell>{unit.imei || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(unit.status)}>
                      {getStatusText(unit.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(unit.createdAt)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(unit)}
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
                          <AlertDialogTitle>
                            Xóa Đơn Vị Sản Phẩm
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa đơn vị sản phẩm này không?
                            Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(unit.id)}
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
      <ProductUnitDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        productId={productId}
        stockQuantity={stockQuantity}
        currentUnitsCount={productUnits.length}
        onSuccess={handleCloseDialog}
      />

      {/* Edit Dialog */}
      <ProductUnitDialog
        open={!!editingUnit}
        onOpenChange={(open: boolean) => !open && setEditingUnit(null)}
        productId={productId}
        productUnit={editingUnit}
        stockQuantity={stockQuantity}
        currentUnitsCount={productUnits.length}
        onSuccess={handleCloseDialog}
      />
    </div>
  );
}
