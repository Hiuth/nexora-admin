"use client";

import { ProductResponse } from "@/types";

interface ProductDetailSectionProps {
  product: ProductResponse;
}

export function ProductDetailSection({ product }: ProductDetailSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold border-b border-muted pb-2">
          Thông tin chi tiết
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              Thương hiệu:
            </span>
            <span className="font-semibold">{product.brandName}</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              Danh mục:
            </span>
            <span className="font-semibold">{product.subCategoryName}</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              ID sản phẩm:
            </span>
            <span className="font-mono text-xs bg-background px-2 py-1 rounded">
              {product.id}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold border-b border-muted pb-2">
          Thống kê
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              Tồn kho:
            </span>
            <span className="font-semibold">
              {product.stockQuantity} sản phẩm
            </span>
          </div>
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              Trạng thái:
            </span>
            <span className="font-semibold">
              {product.status === "ACTIVE" ? "Đang bán" : "Ngừng bán"}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              Bảo hành:
            </span>
            <span className="font-semibold">
              {product.warrantyPeriod} tháng
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
