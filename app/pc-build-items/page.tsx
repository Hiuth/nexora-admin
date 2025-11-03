"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PcBuildSelector } from "@/components/pc-build-items/pc-build-selector";
import { PcBuildItemTable } from "@/components/pc-build-items/pc-build-item-table";
import { usePcBuildItems } from "@/hooks/use-pc-build-items";
import { Loader2, Settings } from "lucide-react";

export default function PcBuildItemsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedPcBuildId, setSelectedPcBuildId] = useState("");
  const [selectedPcBuildName, setSelectedPcBuildName] = useState("");

  const { pcBuildItems, loading, error, refetch, deletePcBuildItem } =
    usePcBuildItems(selectedPcBuildId);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // Reset PC build when category changes
    setSelectedPcBuildId("");
    setSelectedPcBuildName("");
  };

  const handlePcBuildChange = (pcBuildId: string, pcBuildName: string) => {
    setSelectedPcBuildId(pcBuildId);
    setSelectedPcBuildName(pcBuildName);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Linh Kiện Cấu Hình</h1>
            <p className="text-muted-foreground">
              Quản lý các linh kiện trong từng cấu hình máy tính
            </p>
          </div>
        </div>

        {/* PC Build Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn Cấu Hình Máy Tính</CardTitle>
            <CardDescription>
              Chọn danh mục và cấu hình máy tính để xem và quản lý các linh kiện
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PcBuildSelector
              selectedCategoryId={selectedCategoryId}
              selectedPcBuildId={selectedPcBuildId}
              onCategoryChange={handleCategoryChange}
              onPcBuildChange={handlePcBuildChange}
            />
          </CardContent>
        </Card>

        {/* PC Build Items Management */}
        {selectedPcBuildId && (
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Đang tải danh sách linh kiện...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Lỗi: {error}</p>
                </div>
              ) : (
                <PcBuildItemTable
                  pcBuildItems={pcBuildItems}
                  pcBuildId={selectedPcBuildId}
                  pcBuildName={selectedPcBuildName}
                  selectedCategoryId={selectedCategoryId}
                  onRefresh={refetch}
                  onDelete={deletePcBuildItem}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!selectedPcBuildId && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 space-y-4">
                <Settings className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">
                    Chưa chọn cấu hình máy tính
                  </h3>
                  <p className="text-muted-foreground">
                    Vui lòng chọn danh mục và cấu hình máy tính để bắt đầu quản
                    lý linh kiện
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
