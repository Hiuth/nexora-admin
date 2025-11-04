"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Hash, CheckCircle2 } from "lucide-react";
import { OrderDetailResponse } from "@/types";

interface OrderDetailListProps {
  orderDetails: OrderDetailResponse[];
  existingWarranties: string[]; // Array of productIds that already have warranties
  selectedOrderDetail: OrderDetailResponse | null;
  onSelectOrderDetail: (orderDetail: OrderDetailResponse) => void;
}

export function OrderDetailList({
  orderDetails,
  existingWarranties,
  selectedOrderDetail,
  onSelectOrderDetail,
}: OrderDetailListProps) {
  // Filter out order details that already have warranties
  const availableOrderDetails = orderDetails.filter(
    (detail) => !existingWarranties.includes(detail.productId)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Chi tiết đơn hàng</h3>
        <Badge variant="outline">
          {availableOrderDetails.length} sản phẩm có thể tạo bảo hành
        </Badge>
      </div>

      {availableOrderDetails.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <h4 className="font-medium">Hoàn thành</h4>
              <p className="text-muted-foreground text-sm">
                Tất cả sản phẩm trong đơn hàng đã có bảo hành
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {availableOrderDetails.map((detail) => (
            <Card
              key={detail.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedOrderDetail?.id === detail.id
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onSelectOrderDetail(detail)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {detail.productName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-mono">
                          ID: {detail.productId}
                        </span>
                      </div>
                    </div>
                    {selectedOrderDetail?.id === detail.id && (
                      <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Số lượng:</span>
                      <Badge variant="secondary">{detail.quantity}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Đơn giá:</span>
                      <span className="font-medium">
                        {detail.unitPrice.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Tổng:</span>
                    <span className="font-semibold text-blue-600">
                      {detail.price.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
