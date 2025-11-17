"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PcBuildResponse, DialogMode, CategoryResponse, SubCategoryResponse } from "@/types";
import { pcBuildService, categoryService, subCategoryService, productImgService } from "@/lib/api";
import { ImageUploadService } from "../products/image-upload-service";
import { PcBuildFormData } from "./pc-build-form-fields";

interface UsePcBuildFormStandaloneProps {
  open: boolean;
  mode: DialogMode;
  data?: PcBuildResponse;
  onSubmit: () => void;
  onClose: () => void;
}

export function usePcBuildFormStandalone({
  open,
  mode,
  data,
  onSubmit,
  onClose,
}: UsePcBuildFormStandaloneProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [formData, setFormData] = useState<PcBuildFormData>({
    productName: "",
    price: 0,
    description: "",
    status: "ACTIVE",
    categoryId: "",
    subCategoryId: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      loadCategories();
      loadSubCategories();
      
      if (mode === "edit" && data) {
        setFormData({
          productName: data.productName,
          price: data.price,
          description: data.description || "",
          status: data.status,
          categoryId: data.categoryId,
          subCategoryId: data.subCategoryId,
        });
        if (data.thumbnail) {
          setThumbnailPreview(data.thumbnail);
        }
      } else {
        setFormData({
          productName: "",
          price: 0,
          description: "",
          status: "ACTIVE",
          categoryId: "",
          subCategoryId: "",
        });
      }
      setThumbnail(null);
      setAdditionalImages([]);
      setThumbnailPreview(null);
      setAdditionalImagesPreview([]);
    }
  }, [open, mode, data]);

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      additionalImagesPreview.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [thumbnailPreview, additionalImagesPreview]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.code === 1000 && response.result) {
        setCategories(response.result);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error("Không thể tải danh sách danh mục");
    }
  };

  const loadSubCategories = async () => {
    try {
      const response = await subCategoryService.getAll();
      if (response.code === 1000 && response.result) {
        setSubCategories(response.result);
      }
    } catch (error) {
      console.error('Error loading subcategories:', error);
      toast.error("Không thể tải danh sách danh mục con");
    }
  };

  const handleFormDataChange = (fieldOrData: keyof PcBuildFormData | Partial<PcBuildFormData>, value?: any) => {
    if (typeof fieldOrData === 'string') {
      // Single field update
      setFormData(prev => ({ ...prev, [fieldOrData]: value }));
    } else {
      // Object update
      setFormData(prev => ({ ...prev, ...fieldOrData }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);

    if (file) {
      ImageUploadService.createImagePreview(file).then(setThumbnailPreview);
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        await handleCreate();
      } else if (mode === "edit" && data) {
        await handleUpdate();
      }
      
      onSubmit();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!thumbnail) {
      toast.error("Vui lòng chọn ảnh thumbnail");
      throw new Error("Thumbnail required");
    }

    if (!formData.categoryId) {
      toast.error("Vui lòng chọn danh mục");
      throw new Error("Category required");
    }

    if (!formData.productName.trim()) {
      toast.error("Vui lòng nhập tên PC Build");
      throw new Error("Product name required");
    }

    const pcBuildResponse = await pcBuildService.create(
      formData.categoryId,
      formData.subCategoryId || null,
      {
        productName: formData.productName,
        price: formData.price,
        description: formData.description,
        status: formData.status,
      },
      thumbnail
    );

    if (pcBuildResponse.code === 1000 && pcBuildResponse.result) {
      const pcBuildId = pcBuildResponse.result.id;

      // Upload additional images using productImgService (since PC Build inherits from Product)
      if (additionalImages.length > 0) {
        try {
          const uploadPromises = additionalImages.map((file) =>
            productImgService.create(pcBuildId, file)
          );
          
          const uploadResults = await Promise.allSettled(uploadPromises);
          
          const failedUploads = uploadResults.filter(
            (result) => result.status === 'rejected'
          ).length;
          
          if (failedUploads > 0) {
            toast.warning(
              `PC Build đã tạo thành công nhưng có ${failedUploads} ảnh bổ sung tải lên thất bại`
            );
          }
        } catch (error) {
          console.error("Failed to upload additional images:", error);
          toast.warning(
            "PC Build đã tạo thành công nhưng có lỗi khi tải ảnh bổ sung"
          );
        }
      }
      toast.success("Tạo PC Build thành công");
    } else {
      throw new Error("Failed to create PC Build");
    }
  };

  const handleUpdate = async () => {
    if (!data) return;

    let hasChanges = false;
    const updateData: any = {};

    // Check for changes
    if (formData.productName !== data.productName) {
      updateData.productName = formData.productName;
      hasChanges = true;
    }
    if (formData.price !== data.price) {
      updateData.price = formData.price;
      hasChanges = true;
    }
    if (formData.description !== (data.description || "")) {
      updateData.description = formData.description;
      hasChanges = true;
    }
    if (formData.status !== data.status) {
      updateData.status = formData.status;
      hasChanges = true;
    }

    const categoryChanged = formData.categoryId !== data.categoryId;
    const subCategoryChanged = formData.subCategoryId !== data.subCategoryId;
    const thumbnailChanged = thumbnail !== null;
    const hasNewAdditionalImages = additionalImages.length > 0;

    if (!hasChanges && !categoryChanged && !subCategoryChanged && !thumbnailChanged && !hasNewAdditionalImages) {
      toast.info("Không có thay đổi nào để lưu");
      return;
    }

    // Update PC Build basic info
    await pcBuildService.update(
      data.id,
      categoryChanged ? formData.categoryId : undefined,
      subCategoryChanged ? formData.subCategoryId : undefined,
      hasChanges ? updateData : undefined,
      thumbnail || undefined
    );

    // Upload new additional images if any
    if (hasNewAdditionalImages) {
      try {
        const uploadPromises = additionalImages.map((file) =>
          productImgService.create(data.id, file)
        );
        
        const uploadResults = await Promise.allSettled(uploadPromises);
        
        const failedUploads = uploadResults.filter(
          (result) => result.status === 'rejected'
        ).length;
        
        if (failedUploads > 0) {
          toast.warning(
            `PC Build đã cập nhật thành công nhưng có ${failedUploads} ảnh bổ sung tải lên thất bại`
          );
        } else {
          toast.success("Cập nhật PC Build và ảnh bổ sung thành công");
        }
      } catch (error) {
        console.error("Failed to upload additional images:", error);
        toast.warning(
          "PC Build đã cập nhật thành công nhưng có lỗi khi tải ảnh bổ sung"
        );
      }
    } else {
      toast.success("Cập nhật PC Build thành công");
    }
  };

  // Filter subcategories based on selected category
  const filteredSubCategories = formData.categoryId 
    ? subCategories.filter(sub => sub.categoryId === formData.categoryId)
    : [];

  return {
    loading,
    categories,
    subCategories: filteredSubCategories,
    formData,
    thumbnail,
    additionalImages,
    thumbnailPreview,
    additionalImagesPreview,
    handleFormDataChange,
    handleThumbnailChange,
    handleAdditionalImagesChange,
    removeAdditionalImage,
    handleSubmit,
  };
}