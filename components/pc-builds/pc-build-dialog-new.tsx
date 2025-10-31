"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PcBuildResponse, DialogMode } from "@/types";
import { usePcBuildForm } from "./use-pc-build-form";
import { PcBuildFormFields } from "@/components/pc-builds/pc-build-form-fields";
import { ThumbnailUpload } from "@/components/pc-builds/thumbnail-upload";
import { AdditionalImagesUpload } from "@/components/products/additional-images-upload";
import { EditModeImageUpload } from "@/components/pc-builds/edit-mode-image-upload";

interface PcBuildDialogNewProps {
  open: boolean;
  mode: DialogMode;
  data?: PcBuildResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export function PcBuildDialogNew({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: PcBuildDialogNewProps) {
  const {
    loading,
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
  } = usePcBuildForm({ open, mode, data, onSubmit, onClose });

  const isViewMode = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Tạo PC Build mới"}
            {mode === "edit" && "Chỉnh sửa PC Build"}
            {mode === "view" && "Chi tiết PC Build"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PcBuildFormFields
            formData={formData}
            categories={categories}
            subCategories={subCategories}
            onFormDataChange={handleFormDataChange}
            isViewMode={isViewMode}
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
          ) : mode === "edit" && data ? (
            <EditModeImageUpload
              pcBuild={data}
              thumbnailPreview={thumbnailPreview}
              additionalImages={additionalImages}
              additionalImagesPreview={additionalImagesPreview}
              onThumbnailChange={handleThumbnailChange}
              onAdditionalImagesChange={handleAdditionalImagesChange}
              onRemoveNewImage={removeAdditionalImage}
            />
          ) : (
            mode === "view" &&
            data && (
              <>
                {/* View mode current image */}
                {data.thumbnail && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Hình ảnh hiện tại
                    </label>
                    <img
                      src={data.thumbnail}
                      alt={data.productName}
                      className="w-full max-w-xs h-48 object-cover rounded-lg border-2 border-border"
                    />
                  </div>
                )}
              </>
            )
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? "Đóng" : "Hủy"}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Đang xử lý..."
                  : mode === "create"
                  ? "Tạo PC Build"
                  : "Cập nhật"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
