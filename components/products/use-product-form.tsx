"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  ProductResponse,
  BrandResponse,
  SubCategoryResponse,
  CategoryResponse,
  DialogMode,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";
import {
  productService,
  brandService,
  subCategoryService,
  categoryService,
} from "@/lib/api";
import { ProductFormData } from "./product-form-fields";
import { ImageUploadService } from "./image-upload-service";

interface UseProductFormProps {
  open: boolean;
  mode: DialogMode;
  data?: ProductResponse;
  onSubmit: () => void;
  onClose: () => void;
}

export function useProductForm({
  open,
  mode,
  data,
  onSubmit,
  onClose,
}: UseProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    productName: "",
    price: 0,
    stockQuantity: 0,
    description: "",
    status: "ACTIVE",
    warrantyPeriod: 12,
    brandId: "",
    categoryId: "",
    subCategoryId: "",
    isSerial: false,
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (open) {
      loadBrands();
      loadCategories();
      loadSubCategories();
      if (mode === "edit" && data) {
        setFormData({
          productName: data.productName,
          price: data.price,
          stockQuantity: data.stockQuantity,
          description: data.description || "",
          status: data.status,
          warrantyPeriod: data.warrantyPeriod,
          brandId: data.brandId,
          categoryId: data.categoryId,
          subCategoryId: data.subCategoryId,
          isSerial: data.isSerial || false,
        });
      } else {
        setFormData({
          productName: "",
          price: 0,
          stockQuantity: 0,
          description: "",
          status: "ACTIVE",
          warrantyPeriod: 12,
          brandId: "",
          categoryId: "",
          subCategoryId: "",
          isSerial: false,
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
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      additionalImagesPreview.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [thumbnailPreview, additionalImagesPreview]);

  const loadBrands = async () => {
    try {
      const response = await brandService.getAll();
      if (response.code === 1000 && response.result) {
        setBrands(response.result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách thương hiệu");
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.code === 1000 && response.result) {
        setCategories(response.result);
      }
    } catch (error) {
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
      toast.error("Không thể tải danh sách danh mục con");
    }
  };

  const handleFormDataChange = (newData: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
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

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!thumbnail) {
      toast.error("Vui lòng chọn ảnh thumbnail");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    if (!formData.brandId) {
      toast.error("Vui lòng chọn thương hiệu");
      return;
    }

    const request: CreateProductRequest = {
      productName: formData.productName,
      price: formData.price,
      stockQuantity: formData.stockQuantity,
      description: formData.description,
      status: formData.status,
      warrantyPeriod: formData.warrantyPeriod,
      brandId: formData.brandId,
      subCategoryId: formData.subCategoryId,
      isSerial: formData.isSerial,
    };

    const productResponse = await productService.create(
      formData.categoryId,
      formData.brandId,
      request,
      thumbnail,
      formData.subCategoryId
    );

    if (productResponse.code === 1000 && productResponse.result) {
      const productId = productResponse.result.id;

      // Upload additional images if any
      if (additionalImages.length > 0) {
        try {
          await ImageUploadService.uploadAdditionalImages(
            productId,
            additionalImages
          );
        } catch (error) {
          console.error("Failed to upload some additional images:", error);
          toast.warning(
            "Sản phẩm đã tạo thành công nhưng có lỗi khi tải một số ảnh bổ sung"
          );
        }
      }
      toast.success("Tạo sản phẩm thành công");
    } else {
      throw new Error("Failed to create product");
    }
  };

  const handleUpdate = async () => {
    if (!data) return;

    // Prepare update request - always include all fields that might have changed
    const request: UpdateProductRequest = {};
    let hasChanges = false;

    // Check and include all potentially changed fields
    if (formData.productName !== data.productName) {
      request.productName = formData.productName;
      hasChanges = true;
    }
    if (formData.price !== data.price) {
      request.price = formData.price;
      hasChanges = true;
    }
    if (formData.stockQuantity !== data.stockQuantity) {
      request.stockQuantity = formData.stockQuantity;
      hasChanges = true;
    }
    if (formData.description !== (data.description || "")) {
      request.description = formData.description;
      hasChanges = true;
    }
    if (formData.status !== data.status) {
      request.status = formData.status;
      hasChanges = true;
    }
    if (formData.warrantyPeriod !== data.warrantyPeriod) {
      request.warrantyPeriod = formData.warrantyPeriod;
      hasChanges = true;
    }
    if (formData.isSerial !== (data.isSerial || false)) {
      request.isSerial = formData.isSerial;
      hasChanges = true;
    }

    // Check for relationship changes
    const brandChanged = formData.brandId !== data.brandId;
    const categoryChanged = formData.categoryId !== data.categoryId;
    const subCategoryChanged = formData.subCategoryId !== data.subCategoryId;
    const hasNewThumbnail = thumbnail !== null;
    const hasNewImages = additionalImages.length > 0;

    const hasFormChanges =
      hasChanges ||
      brandChanged ||
      categoryChanged ||
      subCategoryChanged ||
      hasNewThumbnail;

    if (hasFormChanges || hasNewImages) {
      // Update product info if there are form changes
      if (hasFormChanges) {
        const response = await productService.update(
          data.id,
          request,
          thumbnail || undefined,
          brandChanged ? formData.brandId : undefined,
          categoryChanged ? formData.categoryId : undefined,
          subCategoryChanged ? formData.subCategoryId : undefined
        );

        if (response.code !== 1000) {
          throw new Error("Failed to update product");
        }
      }

      // Upload additional images if any (independent of form changes)
      if (hasNewImages) {
        try {
          await ImageUploadService.uploadAdditionalImages(
            data.id,
            additionalImages
          );
        } catch (error) {
          console.error("Failed to upload some additional images:", error);
          toast.warning(
            hasFormChanges
              ? "Sản phẩm đã cập nhật thành công nhưng có lỗi khi tải một số ảnh bổ sung"
              : "Có lỗi khi tải ảnh bổ sung"
          );
          return; // Don't throw here, as main update succeeded
        }
      }

      if (hasFormChanges && hasNewImages) {
        toast.success("Cập nhật sản phẩm và tải ảnh thành công");
      } else if (hasFormChanges) {
        toast.success("Cập nhật sản phẩm thành công");
      } else if (hasNewImages) {
        toast.success("Tải ảnh bổ sung thành công");
      }
    } else {
      toast.info("Không có thay đổi nào để cập nhật");
    }
  };

  return {
    loading,
    brands,
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
