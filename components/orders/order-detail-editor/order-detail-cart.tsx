"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, X } from "lucide-react";
import { OrderDetailResponse } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface OrderDetailCartProps {
  orderDetails: OrderDetailResponse[];
  totalAmount: number;
  onDeleteClick: (orderDetail: OrderDetailResponse) => void;
}

export function OrderDetailCart({
  orderDetails,
  totalAmount,
  onDeleteClick,
}: OrderDetailCartProps) {
  return (
    <div className="border rounded-lg">
      <div className="bg-muted px-4 py-2 flex items-center justify-between">
        <h3 className="font-medium">Giỏ hàng</h3>
        <Badge variant="outline" className="text-sm">
          <DollarSign className="h-3 w-3 mr-1" />
          {formatCurrency(totalAmount)}
        </Badge>
      </div>
      <div className="max-h-[200px] overflow-y-auto">
        {orderDetails.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Chưa có sản phẩm nào
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {orderDetails.map((detail) => (
              <Card key={detail.id} className="bg-white">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-xs">
                        {detail.productName}
                      </h4>
                      <div className="text-xs text-muted-foreground">
                        {detail.quantity} × {formatCurrency(detail.unitPrice)}
                      </div>
                      <div className="text-xs font-semibold text-blue-600">
                        {formatCurrency(detail.quantity * detail.unitPrice)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteClick(detail)}
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
