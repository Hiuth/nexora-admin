"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderDetailResponse } from "@/types";
import { Loader2, Trash2, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrderDetailTableProps {
  orderDetails: OrderDetailResponse[];
  loading?: boolean;
  onDeleteAll?: (orderId: string) => Promise<boolean>;
  orderId?: string;
  deleting?: string | null;
}

export function OrderDetailTable({
  orderDetails,
  loading = false,
  onDeleteAll,
  orderId,
  deleting = null,
}: OrderDetailTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (orderDetails.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Chưa có sản phẩm</h3>
        <p className="text-muted-foreground">
          Đơn hàng này chưa có sản phẩm nào
        </p>
      </div>
    );
  }

  const totalAmount = orderDetails.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead className="text-center">Số lượng</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderDetails.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Mã SP: {item.productId}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center gap-2">
          {onDeleteAll && orderId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteAll(orderId)}
              disabled={deleting === orderId}
              className="text-destructive hover:text-destructive"
            >
              {deleting === orderId ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Xóa tất cả
            </Button>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Tổng số sản phẩm: {orderDetails.length}
          </p>
          <p className="text-lg font-bold">
            Tổng tiền: {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}
