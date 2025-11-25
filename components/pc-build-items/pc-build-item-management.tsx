"use client";

import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PcBuildItemDialog } from "./pc-build-item-dialog";
import { PcBuildItemTable } from "./pc-build-item-table";
import { PcBuildResponse, PcBuildItemResponse } from "@/types";
import { usePcBuildItems } from "@/hooks/use-pc-build-items";

interface PcBuildItemManagementProps {
  selectedPcBuild: PcBuildResponse;
}

export function PcBuildItemManagement({
  selectedPcBuild,
}: PcBuildItemManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PcBuildItemResponse | null>(null);

  const { pcBuildItems, loading, error, refetch, deletePcBuildItem } =
    usePcBuildItems(selectedPcBuild.id);

  const handleCreateItem = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEditItem = (item: PcBuildItemResponse) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleSuccess = () => {
    refetch(); // Refresh data after successful operation
    setDialogOpen(false);
    setEditingItem(null);
  };

  if (!selectedPcBuild) return null;

  return (
    <div className="space-y-6">
      {/* PC Build Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cấu hình: {selectedPcBuild.productName}
          </CardTitle>
          <CardDescription>
            Quản lý các linh kiện trong cấu hình máy tính này
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tên cấu hình:</span>
              <span className="font-medium">{selectedPcBuild.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Danh mục:</span>
              <span>{selectedPcBuild.categoryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giá:</span>
              <span className="font-medium text-green-600">
                {selectedPcBuild.price?.toLocaleString()} VND
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              <span className={`font-medium ${
                selectedPcBuild.status === 'ACTIVE' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {selectedPcBuild.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PC Build Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách linh kiện trong cấu hình</CardTitle>
          <CardDescription>
            Các linh kiện hiện có trong cấu hình "{selectedPcBuild.productName}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PcBuildItemTable
            pcBuildItems={pcBuildItems}
            pcBuildId={selectedPcBuild.id}
            pcBuildName={selectedPcBuild.productName}
            selectedCategoryId={selectedPcBuild.categoryId}
            onRefresh={refetch}
            onDelete={deletePcBuildItem}
          />
        </CardContent>
      </Card>

      {/* Dialog for Create/Edit */}
      <PcBuildItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pcBuildId={selectedPcBuild.id}
        selectedCategoryId={selectedPcBuild.categoryId}
        pcBuildItem={editingItem}
        onSuccess={handleSuccess}
      />
    </div>
  );
}