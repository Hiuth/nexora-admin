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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  PcBuildResponse,
  SubCategoryResponse,
  DialogMode,
  CreatePcBuildRequest,
  UpdatePcBuildRequest,
} from "@/types";
import { pcBuildService, subCategoryService } from "@/lib/api";

interface PcBuildDialogProps {
  open: boolean;
  mode: DialogMode;
  data?: PcBuildResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export function PcBuildDialog({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: PcBuildDialogProps) {
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [formData, setFormData] = useState({
    productName: "",
    price: 0,
    description: "",
    status: "ACTIVE",
    subCategoryId: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      loadSubCategories();
      if (mode === "edit" && data) {
        setFormData({
          productName: data.productName,
          price: data.price,
          description: data.description || "",
          status: data.status,
          subCategoryId: data.subCategoryId,
        });
      } else {
        setFormData({
          productName: "",
          price: 0,
          description: "",
          status: "ACTIVE",
          subCategoryId: "",
        });
      }
      setFile(null);
    }
  }, [open, mode, data]);

  const loadSubCategories = async () => {
    try {
      const response = await subCategoryService.getAll();
      if (response.Code === 1000 && response.Result) {
        setSubCategories(response.Result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục con");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        if (!file) {
          toast.error("Vui lòng chọn hình ảnh");
          return;
        }
        const request: CreatePcBuildRequest = {
          productName: formData.productName,
          price: formData.price,
          description: formData.description,
          status: formData.status,
          thumbnail: "",
          subCategoryId: formData.subCategoryId,
          items: [], // Will be added later
        };
        await pcBuildService.create(formData.subCategoryId, request, file);
        toast.success("Tạo PC Build thành công");
      } else if (mode === "edit" && data) {
        const request: UpdatePcBuildRequest = {
          productName: formData.productName,
          price: formData.price,
          description: formData.description,
          status: formData.status,
          subCategoryId: formData.subCategoryId,
        };
        await pcBuildService.update(
          data.id,
          formData.subCategoryId,
          request,
          file || undefined
        );
        toast.success("Cập nhật PC Build thành công");
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Tạo PC Build mới"}
            {mode === "edit" && "Chỉnh sửa PC Build"}
            {mode === "view" && "Chi tiết PC Build"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subCategoryId">Danh mục con</Label>
            <Select
              value={formData.subCategoryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, subCategoryId: value }))
              }
              disabled={isViewMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục con" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.map((subCategory) => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.subCategoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productName">Tên PC Build</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              placeholder="Nhập tên PC Build"
              required
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Giá (VNĐ)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              placeholder="Nhập giá"
              required
              disabled={isViewMode}
              min="0"
              step="1000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Nhập mô tả"
              disabled={isViewMode}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
              disabled={isViewMode}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Bản nháp</SelectItem>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isViewMode && (
            <div className="space-y-2">
              <Label htmlFor="file">Hình ảnh</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required={mode === "create"}
              />
            </div>
          )}

          {mode === "view" && data?.thumbnail && (
            <div className="space-y-2">
              <Label>Hình ảnh hiện tại</Label>
              <img
                src={data.thumbnail}
                alt={data.productName}
                className="w-full max-w-xs h-48 object-cover rounded"
              />
            </div>
          )}

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
