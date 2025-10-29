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
  SubCategoryResponse,
  CategoryResponse,
  DialogMode,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
} from "@/types";
import { subCategoryService, categoryService } from "@/lib/api";

interface SubCategoryDialogProps {
  open: boolean;
  mode: DialogMode;
  data?: SubCategoryResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export function SubCategoryDialog({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: SubCategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [formData, setFormData] = useState({
    subCategoryName: "",
    description: "",
    categoryId: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      loadCategories();
      if (mode === "edit" && data) {
        setFormData({
          subCategoryName: data.subCategoryName,
          description: data.description || "",
          categoryId: data.categoryId,
        });
      } else {
        setFormData({
          subCategoryName: "",
          description: "",
          categoryId: "",
        });
      }
      setFile(null);
    }
  }, [open, mode, data]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.Code === 1000 && response.Result) {
        setCategories(response.Result);
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
        if (!file) {
          toast.error("Vui lòng chọn hình ảnh");
          return;
        }
        const request: CreateSubCategoryRequest = {
          subCategoryName: formData.subCategoryName,
          description: formData.description,
          categoryId: formData.categoryId,
        };
        await subCategoryService.create(formData.categoryId, request, file);
        toast.success("Tạo danh mục con thành công");
      } else if (mode === "edit" && data) {
        const request: UpdateSubCategoryRequest = {
          subCategoryName: formData.subCategoryName,
          description: formData.description,
          categoryId: formData.categoryId,
        };
        await subCategoryService.update(
          data.id,
          formData.categoryId,
          request,
          file || undefined
        );
        toast.success("Cập nhật danh mục con thành công");
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
            {mode === "create" && "Tạo danh mục con mới"}
            {mode === "edit" && "Chỉnh sửa danh mục con"}
            {mode === "view" && "Chi tiết danh mục con"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Danh mục cha</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
              disabled={isViewMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục cha" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCategoryName">Tên danh mục con</Label>
            <Input
              id="subCategoryName"
              value={formData.subCategoryName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  subCategoryName: e.target.value,
                }))
              }
              placeholder="Nhập tên danh mục con"
              required
              disabled={isViewMode}
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
            />
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

          {mode === "view" && data?.subCategoryImg && (
            <div className="space-y-2">
              <Label>Hình ảnh hiện tại</Label>
              <img
                src={data.subCategoryImg}
                alt={data.subCategoryName}
                className="w-full max-w-xs h-32 object-cover rounded"
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
