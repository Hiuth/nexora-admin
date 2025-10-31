"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductResponse, DialogMode } from "@/types";
import { useProductForm } from "./use-product-form";
import { ProductFormFields } from "./product-form-fields";
import { ThumbnailUpload } from "./thumbnail-upload";
import { AdditionalImagesUpload } from "./additional-images-upload";
import { EditModeImageUpload } from "./edit-mode-image-upload";

interface ProductDialogProps {
  open: boolean;
  mode: DialogMode;
  data?: ProductResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export function ProductDialog({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: ProductDialogProps) {
  const {
    loading,
    brands,
    categories,
    subCategories,
    formData,
    thumbnailPreview,
    additionalImages,
    additionalImagesPreview,
    handleFormDataChange,
    handleThumbnailChange,
    handleAdditionalImagesChange,
    removeAdditionalImage,
    handleSubmit,
  } = useProductForm({ open, mode, data, onSubmit, onClose });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo sản phẩm mới" : "Chỉnh sửa sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ProductFormFields
            formData={formData}
            brands={brands}
            categories={categories}
            subCategories={subCategories}
            onFormDataChange={handleFormDataChange}
          />

          {/* Image upload section - different for create vs edit */}
          {mode === "create" ? (
            <>
              <ThumbnailUpload
                thumbnailPreview={thumbnailPreview}
                onThumbnailChange={handleThumbnailChange}
                required={true}
              />

              <AdditionalImagesUpload
                additionalImages={additionalImages}
                additionalImagesPreview={additionalImagesPreview}
                onAdditionalImagesChange={handleAdditionalImagesChange}
                onRemoveImage={removeAdditionalImage}
              />
            </>
          ) : (
            data && (
              <EditModeImageUpload
                product={data}
                thumbnailPreview={thumbnailPreview}
                additionalImages={additionalImages}
                additionalImagesPreview={additionalImagesPreview}
                onThumbnailChange={handleThumbnailChange}
                onAdditionalImagesChange={handleAdditionalImagesChange}
                onRemoveNewImage={removeAdditionalImage}
              />
            )
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Đang xử lý..."
                : mode === "create"
                ? "Tạo"
                : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
