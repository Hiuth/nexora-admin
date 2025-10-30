"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateCategoryRequest, UpdateCategoryRequest } from "@/types/requests";

interface Category {
  id?: string;
  categoryName: string;
  iconImg?: string;
}

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSubmit: (
    data: CreateCategoryRequest | UpdateCategoryRequest,
    file?: File
  ) => void;
}

export function CategoryDialog({
  isOpen,
  onOpenChange,
  category,
  onSubmit,
}: CategoryDialogProps) {
  const [formData, setFormData] = useState({ categoryName: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.categoryName || "",
      });
    } else {
      setFormData({ categoryName: "" });
    }
    setSelectedFile(null);
  }, [category, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData, selectedFile || undefined);
      setFormData({ categoryName: "" });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Sửa danh mục" : "Thêm danh mục"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Cập nhật thông tin danh mục."
              : "Tạo danh mục sản phẩm mới."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Tên danh mục</Label>
            <Input
              id="categoryName"
              placeholder="ví dụ: Điện tử"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iconFile">Hình ảnh icon</Label>
            <Input
              id="iconFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {category?.iconImg && (
              <div className="text-sm text-muted-foreground">
                Icon hiện tại:
                <img
                  src={category.iconImg}
                  alt="Current icon"
                  className="inline w-6 h-6 ml-2 rounded"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : category ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
