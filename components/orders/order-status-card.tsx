"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderResponse } from "@/types";
import { LucideIcon } from "lucide-react";

interface OrderStatusCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color: string;
  orders: OrderResponse[];
  description?: string;
}

export function OrderStatusCard({
  title,
  count,
  icon: Icon,
  color,
  orders,
  description,
}: OrderStatusCardProps) {
  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-4 w-4 ${color.replace("bg-", "text-")}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{count}</div>
            <Badge variant="secondary" className="text-xs">
              {((count / (orders.length || 1)) * 100).toFixed(0)}%
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {description ||
              `Tổng giá trị: ${totalAmount.toLocaleString("vi-VN")} ₫`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
