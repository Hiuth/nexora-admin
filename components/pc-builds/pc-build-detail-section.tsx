"use client";

import { PcBuildResponse } from "@/types";

interface PcBuildDetailSectionProps {
  pcBuild: PcBuildResponse;
}

export function PcBuildDetailSection({ pcBuild }: PcBuildDetailSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold border-b border-muted pb-2">
          Thông tin chi tiết
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              Danh mục:
            </span>
            <span className="font-semibold">{pcBuild.categoryName}</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              Danh mục phụ:
            </span>
            <span className="font-semibold">{pcBuild.subCategoryName}</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              ID PC Build:
            </span>
            <span className="font-mono text-xs bg-background px-2 py-1 rounded">
              {pcBuild.id}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              ID danh mục:
            </span>
            <span className="font-mono text-xs bg-background px-2 py-1 rounded">
              {pcBuild.categoryId}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold border-b border-muted pb-2">
          Thông tin bán hàng
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              Giá bán:
            </span>
            <span className="font-semibold text-green-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(pcBuild.price)}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              Trạng thái:
            </span>
            <span className="font-semibold">
              {pcBuild.status === "ACTIVE"
                ? "Đang bán"
                : pcBuild.status === "DRAFT"
                ? "Bản nháp"
                : "Ngừng bán"}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground font-medium text-sm">
              Loại sản phẩm:
            </span>
            <span className="font-semibold">PC Build</span>
          </div>
        </div>
      </div>
    </div>
  );
}
