"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { ProductResponse } from "@/types";

interface SelectedProductPreviewProps {
  product: ProductResponse | undefined;
}

export function SelectedProductPreview({
  product,
}: SelectedProductPreviewProps) {
  if (!product) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">
              Đã chọn: {product.productName}
            </h4>
            <p className="text-xs text-muted-foreground">
              Giá:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
