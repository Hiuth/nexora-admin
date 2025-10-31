"use client";

import { useState, useEffect, useCallback } from "react";
import { ImageUploadService } from "../products/image-upload-service";

export function usePcBuildImages() {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<
    string[]
  >([]);

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      additionalImagesPreview.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [thumbnailPreview, additionalImagesPreview]);

  const handleThumbnailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setThumbnail(file);

      if (file) {
        ImageUploadService.createImagePreview(file).then(setThumbnailPreview);
      } else {
        setThumbnailPreview(null);
      }
    },
    []
  );

  const handleAdditionalImagesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        setAdditionalImages(files);

        if (files.length > 0) {
          ImageUploadService.createMultipleImagePreviews(files).then(
            setAdditionalImagesPreview
          );
        } else {
          setAdditionalImagesPreview([]);
        }
      }
    },
    []
  );

  const removeAdditionalImage = useCallback((index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagesPreview((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetImages = useCallback(() => {
    setThumbnail(null);
    setAdditionalImages([]);
    setThumbnailPreview(null);
    setAdditionalImagesPreview([]);
  }, []);

  const setThumbnailPreviewDirectly = useCallback((preview: string | null) => {
    setThumbnailPreview(preview);
  }, []);

  return {
    thumbnail,
    additionalImages,
    thumbnailPreview,
    additionalImagesPreview,
    handleThumbnailChange,
    handleAdditionalImagesChange,
    removeAdditionalImage,
    resetImages,
    setThumbnailPreviewDirectly,
  };
}
