"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { PcBuildDialog } from "@/components/pc-builds/pc-build-dialog";
import { PcBuildDetailDialog } from "@/components/pc-builds/pc-build-detail-dialog";
import {
  PcBuildFilter,
  PcBuildFilterState,
} from "@/components/pc-builds/pc-build-filter";
import { PcBuildList } from "@/components/pc-builds/pc-build-list";
import { toast } from "sonner";
import { PcBuildResponse, DialogMode } from "@/types";
import { usePcBuildsInfinite } from "@/hooks/use-pc-builds-infinite";

export default function PcBuildsPage() {
  const {
    pcBuilds,
    loading,
    loadingMore,
    hasMore,
    totalItems,
    fetchPcBuilds,
    loadMorePcBuilds,
    reset,
  } = usePcBuildsInfinite();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [selectedPcBuild, setSelectedPcBuild] = useState<
    PcBuildResponse | undefined
  >();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPcBuildForDetail, setSelectedPcBuildForDetail] =
    useState<PcBuildResponse | null>(null);

  const [filters, setFilters] = useState<PcBuildFilterState>({
    search: "",
    categoryId: "all",
    subCategoryId: "all",
    status: "all",
  });

  useEffect(() => {
    loadPcBuilds();
  }, []);

  const loadPcBuilds = async (customFilters?: PcBuildFilterState) => {
    const currentFilters = customFilters || filters;
    
    // Convert PcBuildFilterState to PcBuildFilterOptions for the hook
    const filterOptions = {
      categoryId: (currentFilters.categoryId && currentFilters.categoryId !== "all") ? currentFilters.categoryId : undefined,
      subCategoryId: (currentFilters.subCategoryId && currentFilters.subCategoryId !== "all") ? currentFilters.subCategoryId : undefined,
      status: (currentFilters.status && currentFilters.status !== "all") ? currentFilters.status : undefined,
    };

    await fetchPcBuilds(filterOptions);
  };

  const handleSearch = () => {
    loadPcBuilds();
  };

  const handleFiltersChange = (newFilters: PcBuildFilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: PcBuildFilterState = {
      search: "",
      categoryId: "all",
      subCategoryId: "all",
      status: "all",
    };
    setFilters(resetFilters);
    loadPcBuilds(resetFilters);
  };

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedPcBuild(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (pcBuild: PcBuildResponse) => {
    setDialogMode("edit");
    setSelectedPcBuild(pcBuild);
    setDialogOpen(true);
  };

  const handleViewDetail = (pcBuild: PcBuildResponse) => {
    setSelectedPcBuildForDetail(pcBuild);
    setDetailDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    loadPcBuilds();
  };

  // Filter pc builds client-side for status filter if needed
  const filteredPcBuilds = pcBuilds.filter((pcBuild) => {
    // Additional client-side filtering can be added here if needed
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý PC Build
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý các cấu hình máy tính xây sẵn
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            Thêm PC Build
          </button>
        </div>

        {/* Search and Filter Component */}
        <PcBuildFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          onReset={handleResetFilters}
        />

        {/* PC Builds List with Infinite Scroll */}
        <PcBuildList
          pcBuilds={filteredPcBuilds}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          totalItems={totalItems}
          onLoadMore={loadMorePcBuilds}
          onEdit={handleEdit}
          onViewDetail={handleViewDetail}
          enableInfiniteScroll={true}
        />

        <PcBuildDialog
          open={dialogOpen}
          mode={dialogMode}
          data={selectedPcBuild}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleDialogSubmit}
        />

        <PcBuildDetailDialog
          open={detailDialogOpen}
          pcBuild={selectedPcBuildForDetail}
          onOpenChange={(open) => {
            setDetailDialogOpen(open);
            if (!open) {
              setSelectedPcBuildForDetail(null);
            }
          }}
        />
      </div>
    </AdminLayout>
  );
}
