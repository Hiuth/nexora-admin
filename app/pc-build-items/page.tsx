"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { PcBuildSelectorInfinite } from "@/components/pc-build-items/pc-build-selector-infinite";
import { PcBuildItemManagement } from "@/components/pc-build-items/pc-build-item-management";
import { PcBuildResponse } from "@/types";

export default function PcBuildItemsPage() {
  const [selectedPcBuild, setSelectedPcBuild] = useState<PcBuildResponse | null>(null);

  const handlePcBuildSelect = (pcBuild: PcBuildResponse | null) => {
    setSelectedPcBuild(pcBuild);
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
              Quản lý các linh kiện trong từng cấu hình máy tính với auto loading và filter theo danh mục máy bộ Nexora
            </p>
          </div>
        </div>

        {/* PC Build Selector */}
        <PcBuildSelectorInfinite
          onPcBuildSelect={handlePcBuildSelect}
          selectedPcBuild={selectedPcBuild}
          title="Chọn cấu hình máy tính"
          description="Tìm kiếm và chọn cấu hình máy tính để quản lý linh kiện với infinite scroll"
        />

        {/* PC Build Items Management */}
        {selectedPcBuild && (
          <PcBuildItemManagement selectedPcBuild={selectedPcBuild} />
        )}
      </div>
    </AdminLayout>
  );
}