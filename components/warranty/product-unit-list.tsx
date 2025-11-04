"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package2,
  Smartphone,
  Hash,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";
import { OrderDetailResponse, ProductUnitResponse } from "@/types";
import { useProductUnits } from "@/hooks/use-product-units";

interface ProductUnitListProps {
  selectedOrderDetail: OrderDetailResponse | null;
  selectedProductUnit: ProductUnitResponse | null;
  onSelectProductUnit: (productUnit: ProductUnitResponse) => void;
  onCreateWarranty: () => void;
  creating: boolean;
}

export function ProductUnitList({
  selectedOrderDetail,
  selectedProductUnit,
  onSelectProductUnit,
  onCreateWarranty,
  creating,
}: ProductUnitListProps) {
  const { productUnits, loading } = useProductUnits(
    selectedOrderDetail?.productId
  );

  // Filter only available product units
  const availableProductUnits = productUnits.filter(
    (unit) =>
      unit.status.toUpperCase() === "AVAILABLE" ||
      unit.status.toUpperCase() === "CÓ SẴN"
  );

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "AVAILABLE":
      case "CÓ SẴN":
        return "bg-green-500";
      case "SOLD":
      case "ĐÃ BÁN":
        return "bg-red-500";
      case "RESERVED":
      case "ĐÃ ĐẶT":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
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
      case "RESERVED":
        return "Đã đặt";
      case "ĐÃ ĐẶT":
        return "Đã đặt";
      default:
        return status;
    }
  };

  if (!selectedOrderDetail) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            Đơn vị sản phẩm
          </h3>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 space-y-2">
              <Package2 className="h-12 w-12 text-muted-foreground/50 mx-auto" />
              <h4 className="font-medium text-muted-foreground">
                Chưa chọn sản phẩm
              </h4>
              <p className="text-muted-foreground text-sm">
                Vui lòng chọn một sản phẩm từ danh sách bên trái
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package2 className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Đơn vị sản phẩm</h3>
        <Badge variant="outline">{selectedOrderDetail.productName}</Badge>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : availableProductUnits.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 space-y-2">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto" />
              <h4 className="font-medium">Không có đơn vị khả dụng</h4>
              <p className="text-muted-foreground text-sm">
                Sản phẩm này hiện không có đơn vị nào có sẵn để tạo bảo hành
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {availableProductUnits.map((unit) => (
              <Card
                key={unit.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedProductUnit?.id === unit.id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onSelectProductUnit(unit)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm font-mono">
                            Unit ID: {unit.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={`text-white ${getStatusColor(
                              unit.status
                            )}`}
                          >
                            {getStatusText(unit.status)}
                          </Badge>
                        </div>
                      </div>
                      {selectedProductUnit?.id === unit.id && (
                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                      )}
                    </div>

                    {(unit.serialNumber || unit.imei) && (
                      <div className="space-y-2">
                        {unit.serialNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <Package2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Serial:
                            </span>
                            <span className="font-mono">
                              {unit.serialNumber}
                            </span>
                          </div>
                        )}
                        {unit.imei && (
                          <div className="flex items-center gap-2 text-sm">
                            <Smartphone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">IMEI:</span>
                            <span className="font-mono">{unit.imei}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Tạo:{" "}
                      {new Date(unit.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedProductUnit && (
            <div className="pt-4 border-t">
              <Button
                onClick={onCreateWarranty}
                disabled={creating}
                className="w-full"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang tạo bảo hành...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Tạo bảo hành cho đơn vị này
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
