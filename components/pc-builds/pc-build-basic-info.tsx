"use client";

import { Badge } from "@/components/ui/badge";
import { PcBuildResponse } from "@/types";

interface PcBuildBasicInfoProps {
  pcBuild: PcBuildResponse;
}

export function PcBuildBasicInfo({ pcBuild }: PcBuildBasicInfoProps) {
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
    switch (status) {
      case "ACTIVE":
        return (
          <Badge
            variant="default"
            className="bg-green-500/20 text-green-400 border-green-500/30"
          >
            Hoạt động
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge
            variant="secondary"
            className="bg-gray-500/20 text-gray-400 border-gray-500/30"
          >
            Bản nháp
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge
            variant="secondary"
            className="bg-red-500/20 text-red-400 border-red-500/30"
          >
            Ngừng hoạt động
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-gray-500/20 text-gray-400 border-gray-500/30"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {pcBuild.productName}
        </h2>
        <div className="flex items-center gap-2 mb-4">
          {getStatusBadge(pcBuild.status)}
        </div>
      </div>

      <div className="space-y-3 text-base">
        <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
          <span className="text-muted-foreground font-medium">Giá:</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(pcBuild.price)}
          </span>
        </div>

        <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
          <span className="text-muted-foreground font-medium">Danh mục:</span>
          <span className="font-semibold">{pcBuild.categoryName}</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
          <span className="text-muted-foreground font-medium">
            Danh mục phụ:
          </span>
          <span className="font-semibold">{pcBuild.subCategoryName}</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
          <span className="text-muted-foreground font-medium">
            ID PC Build:
          </span>
          <span className="font-mono text-xs bg-background px-2 py-1 rounded">
            {pcBuild.id}
          </span>
        </div>
      </div>

      {/* Mô tả PC Build */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Mô tả PC Build</h3>
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
            {pcBuild.description || "Không có mô tả."}
          </p>
        </div>
      </div>
    </div>
  );
}
