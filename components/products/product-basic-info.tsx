"use client";

import { Badge } from "@/components/ui/badge";
import { ProductResponse } from "@/types";

interface ProductBasicInfoProps {
  product: ProductResponse;
}

export function ProductBasicInfo({ product }: ProductBasicInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE" ? (
      <Badge
        variant="default"
        className="bg-green-500/20 text-green-400 border-green-500/30"
      >
        Hoạt động
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="bg-gray-500/20 text-gray-400 border-gray-500/30"
      >
        Ngừng hoạt động
      </Badge>
    );
  };

  const getStockBadge = (stock: number) => {
    if (stock > 50) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Nhiều hàng ({stock})
        </Badge>
      );
    } else if (stock > 10) {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          Đủ hàng ({stock})
        </Badge>
      );
    } else if (stock > 0) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          Sắp hết ({stock})
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          Hết hàng ({stock})
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {product.productName}
        </h2>
        <div className="flex items-center gap-2 mb-4">
          {getStatusBadge(product.status)}
          {getStockBadge(product.stockQuantity)}
        </div>
      </div>

      <div className="space-y-3 text-base">
        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
          <span className="text-muted-foreground font-medium">Giá:</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
          <span className="text-muted-foreground font-medium">
            Thương hiệu:
          </span>
          <span className="font-semibold">{product.brandName}</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
          <span className="text-muted-foreground font-medium">Danh mục:</span>
          <span className="font-semibold">{product.subCategoryName}</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
          <span className="text-muted-foreground font-medium">Bảo hành:</span>
          <span className="font-semibold">{product.warrantyPeriod} tháng</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
          <span className="text-muted-foreground font-medium">Ngày tạo:</span>
          <span className="font-semibold">{formatDate(product.createdAt)}</span>
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Mô tả sản phẩm</h3>
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
            {product.description || "Không có mô tả."}
          </p>
        </div>
      </div>
    </div>
  );
}
