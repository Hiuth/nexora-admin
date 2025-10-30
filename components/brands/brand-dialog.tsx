"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  BrandResponse,
  CategoryResponse,
  DialogMode,
  CreateBrandRequest,
  UpdateBrandRequest,
} from "@/types";
import { brandService, categoryService } from "@/lib/api";

interface BrandDialogProps {
  open: boolean;
  mode: DialogMode;
  data?: BrandResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export function BrandDialog({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: BrandDialogProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [formData, setFormData] = useState({
    brandName: "",
    categoryId: "",
  });

  useEffect(() => {
    if (open) {
      loadCategories();
      if (mode === "edit" && data) {
        setFormData({
          brandName: data.brandName,
          categoryId: data.categoryId,
        });
      } else {
        setFormData({
          brandName: "",
          categoryId: "",
        });
      }
    }
  }, [open, mode, data]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.code === 1000 && response.result) {
        setCategories(response.result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const request: CreateBrandRequest = {
          brandName: formData.brandName,
          categoryId: formData.categoryId, // Keep for type compatibility, but won't be sent in body
        };
        await brandService.create(formData.categoryId, request);
        toast.success("Tạo thương hiệu thành công");
      } else if (mode === "edit" && data) {
        // Chỉ gửi những field thay đổi
        const request: Partial<UpdateBrandRequest> = {};
        let targetCategoryId = data.categoryId;

        if (formData.brandName !== data.brandName) {
          request.brandName = formData.brandName;
        }

        if (formData.categoryId !== data.categoryId) {
          request.categoryId = formData.categoryId;
          targetCategoryId = formData.categoryId;
        }

        // Chỉ gửi request nếu có thay đổi
        if (Object.keys(request).length > 0) {
          await brandService.update(
            data.id,
            targetCategoryId,
            request as UpdateBrandRequest
          );
          toast.success("Cập nhật thương hiệu thành công");
        } else {
          toast.info("Không có thay đổi nào để cập nhật");
        }
      }
      onSubmit();
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const isViewMode = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Tạo thương hiệu mới"}
            {mode === "edit" && "Chỉnh sửa thương hiệu"}
            {mode === "view" && "Chi tiết thương hiệu"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Danh mục</Label>
            {isViewMode ? (
              <Input
                value={data?.categoryName || "Không xác định"}
                disabled
                className="bg-muted"
              />
            ) : (
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categoryId: value }))
                }
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandName">Tên thương hiệu</Label>
            <Input
              id="brandName"
              value={isViewMode ? data?.brandName || "" : formData.brandName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  brandName: e.target.value,
                }))
              }
              placeholder="Nhập tên thương hiệu"
              required
              disabled={isViewMode}
              className={isViewMode ? "bg-muted" : ""}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? "Đóng" : "Hủy"}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Đang xử lý..."
                  : mode === "create"
                  ? "Tạo"
                  : "Cập nhật"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
