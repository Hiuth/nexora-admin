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
import { AttributesResponse, CategoryResponse } from "@/types";
import { Loader2 } from "lucide-react";
import { AttributeFormFields } from "./attribute-form-fields";

interface AttributeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  attribute?: AttributesResponse | null;
  categories: CategoryResponse[];
  onSubmit: (categoryId: string, attributeName: string) => Promise<boolean>;
  loading?: boolean;
}

export function AttributeDialog({
  isOpen,
  onOpenChange,
  attribute,
  categories,
  onSubmit,
  loading = false,
}: AttributeDialogProps) {
  const [formData, setFormData] = useState({
    attributeName: "",
    categoryId: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (attribute) {
      setFormData({
        attributeName: attribute.attributeName,
        categoryId: attribute.categoryId,
      });
    } else {
      setFormData({
        attributeName: "",
        categoryId: "",
      });
    }
    setErrors({});
  }, [attribute, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.attributeName.trim()) {
      newErrors.attributeName = "Tên thuộc tính là bắt buộc";
    } else if (formData.attributeName.trim().length < 2) {
      newErrors.attributeName = "Tên thuộc tính phải có ít nhất 2 ký tự";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(
      formData.categoryId,
      formData.attributeName.trim()
    );

    if (success) {
      setFormData({ attributeName: "", categoryId: "" });
      setErrors({});
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setFormData({ attributeName: "", categoryId: "" });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {attribute ? "Chỉnh sửa thuộc tính" : "Thêm thuộc tính mới"}
          </DialogTitle>
          <DialogDescription>
            {attribute
              ? "Cập nhật thông tin thuộc tính."
              : "Tạo một thuộc tính sản phẩm mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AttributeFormFields
            attributeName={formData.attributeName}
            onAttributeNameChange={(value) =>
              setFormData({ ...formData, attributeName: value })
            }
            categoryId={formData.categoryId}
            onCategoryIdChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
            categories={categories}
            disabled={loading}
            errors={errors}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {attribute ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
