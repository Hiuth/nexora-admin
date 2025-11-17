"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PcBuildResponse, DialogMode } from "@/types";
import { usePcBuildFormStandalone } from "./use-pc-build-form-standalone";
import { PcBuildFormFields } from "./pc-build-form-fields";
import { PcBuildThumbnailUpload } from "./pc-build-thumbnail-upload";
import { PcBuildAdditionalImagesUpload } from "./pc-build-additional-images-upload";

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
  } = usePcBuildFormStandalone({
    open,
    mode,
    data,
    onSubmit,
    onClose,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo PC Build mới" : "Chỉnh sửa PC Build"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <PcBuildFormFields
            formData={formData}
            categories={categories}
            subCategories={subCategories}
            onFormDataChange={handleFormDataChange}
          />

          {/* Image Upload Section */}
          <div className="space-y-4">
            <PcBuildThumbnailUpload
              thumbnailPreview={thumbnailPreview}
              onThumbnailChange={handleThumbnailChange}
              required={mode === "create"}
            />

            <PcBuildAdditionalImagesUpload
              additionalImages={additionalImages}
              additionalImagesPreview={additionalImagesPreview}
              onAdditionalImagesChange={handleAdditionalImagesChange}
              onRemoveImage={removeAdditionalImage}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "create" ? "Tạo PC Build" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}