"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PcBuildResponse, DialogMode } from "@/types";
import { usePcBuildsContext } from "./pc-builds-context";
import { usePcBuildCategories } from "./use-pc-build-categories";
import { usePcBuildImages } from "./use-pc-build-images";
import { usePcBuildFormData } from "./use-pc-build-form-data";
import { PcBuildOperations } from "./pc-build-operations";

interface UsePcBuildFormProps {
  open: boolean;
  mode: DialogMode;
  data?: PcBuildResponse;
  onSubmit: () => void;
  onClose: () => void;
}

export function usePcBuildForm({
  open,
  mode,
  data,
  onSubmit,
  onClose,
}: UsePcBuildFormProps) {
  const { loadPcBuilds, currentPage } = usePcBuildsContext();
  const [loading, setLoading] = useState(false);

  // Use custom hooks
  const { categories, subCategories } = usePcBuildCategories();
  const {
    thumbnail,
    additionalImages,
    thumbnailPreview,
    additionalImagesPreview,
    handleThumbnailChange,
    handleAdditionalImagesChange,
    removeAdditionalImage,
    resetImages,
    setThumbnailPreviewDirectly,
  } = usePcBuildImages();
  const { formData, handleFormDataChange, initializeFormData } =
    usePcBuildFormData();

  useEffect(() => {
    if (open) {
      initializeFormData(mode, data);

      if (mode === "create") {
        resetImages();
      } else if (mode === "edit" && data?.thumbnail) {
        resetImages();
        setThumbnailPreviewDirectly(data.thumbnail);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, data?.id]); // Only depend on stable values

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const onSuccess = async () => {
          await loadPcBuilds(currentPage);
          onSubmit();
          onClose();
        };

        if (mode === "create") {
          if (!thumbnail) {
            toast.error("Vui lòng chọn ảnh thumbnail");
            return;
          }
          await PcBuildOperations.create(
            formData,
            thumbnail,
            additionalImages,
            onSuccess
          );
        } else if (mode === "edit" && data) {
          await PcBuildOperations.update(
            data,
            formData,
            thumbnail,
            additionalImages,
            onSuccess
          );
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    },
    [
      mode,
      thumbnail,
      formData,
      additionalImages,
      data,
      loadPcBuilds,
      currentPage,
      onSubmit,
      onClose,
    ]
  );

  return {
    loading,
    categories,
    subCategories,
    formData,
    thumbnail,
    additionalImages,
    thumbnailPreview,
    additionalImagesPreview,
    mode,
    handleFormDataChange,
    handleThumbnailChange,
    handleAdditionalImagesChange,
    removeAdditionalImage,
    handleSubmit,
  };
}
