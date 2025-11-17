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
import { OrderDetailResponse, ProductUnitResponse, ProductResponse } from "@/types";
import { useProductUnits } from "@/hooks/use-product-units";
import { productService } from "@/lib/api";
import React from "react";

interface ProductUnitListProps {
  selectedOrderDetail: OrderDetailResponse | null;
  selectedProductUnit: ProductUnitResponse | null;
  onSelectProductUnit: (productUnit: ProductUnitResponse) => void;
  onCreateWarranty: () => void;
  onCreateWarrantyForNonSerial?: () => void;
  creating: boolean;
}

export function ProductUnitList({
  selectedOrderDetail,
  selectedProductUnit,
  onSelectProductUnit,
  onCreateWarranty,
  onCreateWarrantyForNonSerial,
  creating,
}: ProductUnitListProps) {
  const [productInfo, setProductInfo] = React.useState<ProductResponse | null>(null);
  const [loadingProduct, setLoadingProduct] = React.useState(false);
  
  const { productUnits, loading } = useProductUnits(
    selectedOrderDetail?.productId
  );

  // Fetch product information to check if it has serial
  React.useEffect(() => {
    if (selectedOrderDetail?.productId) {
      setLoadingProduct(true);
      productService
        .getById(selectedOrderDetail.productId)
        .then((response) => {
          // ApiResponse structure: { code: 1000, message: "...", result: T }
          setProductInfo(response.result || null);
        })
        .catch((error) => {
          console.error("Failed to fetch product info:", error);
        })
        .finally(() => {
          setLoadingProduct(false);
        });
    }
  }, [selectedOrderDetail?.productId]);

  // Filter only sold product units (for warranty)
  const soldProductUnits = productUnits.filter(
    (unit) =>
      unit.status.toUpperCase() === "SOLD" ||
      unit.status.toUpperCase() === "ĐÃ BÁN"
  );

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "AVAILABLE":
      case "CÓ SẴN":
        return "bg-green-500";
      case "SOLD":
      case "ĐÃ BÁN":
        return "bg-red-500";
      case "WARRANTY":
      case "ĐANG BẢO HÀNH":
        return "bg-blue-500";
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
      ) : soldProductUnits.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto" />
              <div>
                <h4 className="font-medium">
                  {loadingProduct 
                    ? "Đang tải thông tin sản phẩm..."
                    : productInfo?.isSerial 
                    ? "Không có sản phẩm đã bán" 
                    : "Sản phẩm không có serial"
                  }
                </h4>
                <p className="text-muted-foreground text-sm">
                  {loadingProduct 
                    ? "Vui lòng chờ..."
                    : productInfo?.isSerial 
                    ? "Sản phẩm này hiện không có đơn vị nào đã bán để tạo bảo hành"
                    : "Sản phẩm này không cần theo dõi serial, bạn có thể tạo bảo hành trực tiếp"
                  }
                </p>
              </div>
              
              {/* Show create warranty button for non-serial products */}
              {!loadingProduct && productInfo && productInfo.isSerial === false && onCreateWarrantyForNonSerial && (
                <Button
                  onClick={onCreateWarrantyForNonSerial}
                  disabled={creating}
                  className="mt-4"
                  size="lg"
                >
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Package2 className="mr-2 h-4 w-4" />
                      Tạo bảo hành
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {soldProductUnits.map((unit) => (
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
