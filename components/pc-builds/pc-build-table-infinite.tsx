"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit } from "lucide-react";
import { PcBuildResponse } from "@/types";
import { getStatusColor, getStatusText, formatCurrency } from "@/lib/api-utils";

interface PcBuildTableProps {
  pcBuilds: PcBuildResponse[];
  loading: boolean;
  onEdit: (pcBuild: PcBuildResponse) => void;
  onViewDetail: (pcBuild: PcBuildResponse) => void;
}

export function PcBuildTable({
  pcBuilds,
  loading,
  onEdit,
  onViewDetail,
}: PcBuildTableProps) {
  if (loading && pcBuilds.length === 0) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Đang tải PC Builds...</p>
        </div>
      </div>
    );
  }

  if (pcBuilds.length === 0) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <p className="text-gray-500">Không có PC Build nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Tên PC Build</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pcBuilds.map((pcBuild) => (
              <TableRow key={pcBuild.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {pcBuild.thumbnail && (
                      <img
                        src={pcBuild.thumbnail}
                        alt={pcBuild.productName}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{pcBuild.productName}</div>
                      {pcBuild.description && (
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {pcBuild.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{pcBuild.categoryName}</div>
                    {pcBuild.subCategoryName && (
                      <div className="text-sm text-gray-500">
                        {pcBuild.subCategoryName}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(pcBuild.price)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(pcBuild.status)}
                  >
                    {getStatusText(pcBuild.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(pcBuild)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(pcBuild)}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {pcBuilds.map((pcBuild) => (
          <div key={pcBuild.id} className="bg-white border rounded-lg p-4 space-y-3">
            {/* Header with thumbnail and name */}
            <div className="flex items-start gap-3">
              {pcBuild.thumbnail && (
                <img
                  src={pcBuild.thumbnail}
                  alt={pcBuild.productName}
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-foreground truncate">
                  {pcBuild.productName}
                </h3>
                {pcBuild.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {pcBuild.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Danh mục:</span>
                <div className="font-medium">{pcBuild.categoryName}</div>
                {pcBuild.subCategoryName && (
                  <div className="text-muted-foreground text-xs">
                    {pcBuild.subCategoryName}
                  </div>
                )}
              </div>
              <div>
                <span className="text-muted-foreground">Giá:</span>
                <div className="font-medium">{formatCurrency(pcBuild.price)}</div>
              </div>
            </div>
            
            {/* Status and actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <Badge
                variant="secondary"
                className={`${getStatusColor(pcBuild.status)} text-xs`}
              >
                {getStatusText(pcBuild.status)}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetail(pcBuild)}
                  className="text-xs px-3"
                >
                  <Eye size={14} className="mr-1" />
                  Xem
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(pcBuild)}
                  className="text-xs px-3"
                >
                  <Edit size={14} className="mr-1" />
                  Sửa
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}