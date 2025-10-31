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
import { ProductAttributeResponse, AttributesResponse } from "@/types";
import { Loader2 } from "lucide-react";
import { ProductAttributeFormFields } from "./product-attribute-form-fields";

interface ProductAttributeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productAttribute?: ProductAttributeResponse | null;
  attributes: AttributesResponse[];
  selectedProductId: string;
  onSubmit: (
    attributeId: string,
    productId: string,
    value: string
  ) => Promise<boolean>;
  onUpdate: (
    productAttributeId: string,
    attributeId?: string,
    value?: string
  ) => Promise<boolean>;
  loading?: boolean;
}

export function ProductAttributeDialog({
  isOpen,
  onOpenChange,
  productAttribute,
  attributes,
  selectedProductId,
  onSubmit,
  onUpdate,
  loading = false,
}: ProductAttributeDialogProps) {
  const [formData, setFormData] = useState({
    attributeId: "",
    value: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (productAttribute) {
      setFormData({
        attributeId: productAttribute.attributeId,
        value: productAttribute.value,
      });
    } else {
      setFormData({
        attributeId: "",
        value: "",
      });
    }
    setErrors({});
  }, [productAttribute, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.attributeId) {
      newErrors.attributeId = "Vui lòng chọn thuộc tính";
    }

    if (!formData.value.trim()) {
      newErrors.value = "Giá trị thuộc tính là bắt buộc";
    } else if (formData.value.trim().length < 1) {
      newErrors.value = "Giá trị thuộc tính phải có ít nhất 1 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let success = false;
    if (productAttribute) {
      success = await onUpdate(
        productAttribute.id,
        formData.attributeId,
        formData.value.trim()
      );
    } else {
      success = await onSubmit(
        formData.attributeId,
        selectedProductId,
        formData.value.trim()
      );
    }

    if (success) {
      setFormData({ attributeId: "", value: "" });
      setErrors({});
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setFormData({ attributeId: "", value: "" });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {productAttribute
              ? "Chỉnh sửa thuộc tính sản phẩm"
              : "Thêm thuộc tính sản phẩm"}
          </DialogTitle>
          <DialogDescription>
            {productAttribute
              ? "Cập nhật giá trị thuộc tính cho sản phẩm."
              : "Thêm giá trị thuộc tính mới cho sản phẩm."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ProductAttributeFormFields
            attributeId={formData.attributeId}
            onAttributeIdChange={(value) =>
              setFormData({ ...formData, attributeId: value })
            }
            value={formData.value}
            onValueChange={(value) => setFormData({ ...formData, value })}
            attributes={attributes}
            disabled={loading}
            disableAttributeSelect={!!productAttribute}
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
              {productAttribute ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
