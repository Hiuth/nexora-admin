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
import {
  ProductAttributeResponse,
  AttributesResponse,
  ProductResponse,
} from "@/types";
import { Loader2, Tag } from "lucide-react";
import { ProductAttributeFormFields } from "./product-attribute-form-fields";
import { toast } from "sonner";

interface ProductAttributeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productAttribute?: ProductAttributeResponse | null;
  attributes: AttributesResponse[];
  selectedProduct: ProductResponse | null;
  selectedProductId: string;
  onSubmit: (
    attributeId: string,
    productId: string,
    value: string
  ) => Promise<boolean>;
  onUpdate: (
    productAttributeId: string,
    attributeId: string,
    value: string
  ) => Promise<boolean>;
  loading?: boolean;
}

export function ProductAttributeDialog({
  isOpen,
  onOpenChange,
  productAttribute,
  attributes,
  selectedProduct,
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
      // Check what has actually changed
      const hasAttributeChanged =
        formData.attributeId !== productAttribute.attributeId;
      const hasValueChanged = formData.value.trim() !== productAttribute.value;

      // Only proceed if something has changed
      if (!hasAttributeChanged && !hasValueChanged) {
        toast.info("Không có thay đổi nào để cập nhật");
        onOpenChange(false);
        return;
      }

      // For update, we need to send the actual values, not just changed ones
      // Send the current attributeId if it hasn't changed, or the new one if it has
      const attributeIdToSend = hasAttributeChanged
        ? formData.attributeId
        : productAttribute.attributeId;
      const valueToSend = hasValueChanged
        ? formData.value.trim()
        : productAttribute.value;

      success = await onUpdate(
        productAttribute.id,
        attributeIdToSend,
        valueToSend
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
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {productAttribute ? "Chỉnh Sửa Thuộc Tính" : "Thêm Thuộc Tính Mới"}
          </DialogTitle>
          <DialogDescription>
            {productAttribute
              ? "Cập nhật giá trị thuộc tính cho sản phẩm"
              : selectedProduct
              ? `Thêm thuộc tính cho sản phẩm "${selectedProduct.productName}" (${selectedProduct.categoryName}). Chỉ hiển thị thuộc tính chưa được sử dụng.`
              : "Thêm giá trị thuộc tính mới cho sản phẩm"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex justify-end space-x-2 pt-4 border-t">
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
              {productAttribute ? "Cập Nhật" : "Thêm Mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
