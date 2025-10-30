"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { BrandTable } from "@/components/brands/brand-table";
import { BrandDialog } from "@/components/brands/brand-dialog";
import { toast } from "sonner";
import { BrandResponse, DialogMode } from "@/types";
import { brandService } from "@/lib/api";

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [selectedBrand, setSelectedBrand] = useState<
    BrandResponse | undefined
  >();

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await brandService.getAll();
      if (response.code === 1000 && response.result) {
        setBrands(response.result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedBrand(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (brand: BrandResponse) => {
    setDialogMode("edit");
    setSelectedBrand(brand);
    setDialogOpen(true);
  };

  const handleView = (brand: BrandResponse) => {
    setDialogMode("view");
    setSelectedBrand(brand);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      return;
    }

    try {
      // Delete API is not available in backend yet
      toast.info("Chức năng xóa chưa được hỗ trợ bởi backend");
    } catch (error) {
      toast.error("Không thể xóa thương hiệu");
    }
  };

  const handleDialogSubmit = () => {
    loadBrands();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý thương hiệu
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý các thương hiệu sản phẩm
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            Thêm thương hiệu
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">Đang tải...</div>
          </div>
        ) : (
          <BrandTable
            brands={brands}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}

        <BrandDialog
          open={dialogOpen}
          mode={dialogMode}
          data={selectedBrand}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleDialogSubmit}
        />
      </div>
    </AdminLayout>
  );
}
