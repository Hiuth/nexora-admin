"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  ProductResponse,
  BrandResponse,
  SubCategoryResponse,
  DialogMode,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";
import { productService, brandService, subCategoryService } from "@/lib/api";
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
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    productName: "",
    price: 0,
    stockQuantity: 0,
    description: "",
    status: "ACTIVE",
    warrantyPeriod: 12,
    brandId: "",
    subCategoryId: "",
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
          subCategoryId: data.subCategoryId,
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

    const request: CreateProductRequest = {
      productName: formData.productName,
      price: formData.price,
      stockQuantity: formData.stockQuantity,
      description: formData.description,
      status: formData.status,
      warrantyPeriod: formData.warrantyPeriod,
      brandId: formData.brandId,
      subCategoryId: formData.subCategoryId,
    };

    const productResponse = await productService.create(
      formData.brandId,
      request,
      thumbnail,
      formData.subCategoryId
    );

    if (productResponse.code === 1000 && productResponse.result) {
      const productId = productResponse.result.id;
      console.log("Product created successfully with ID:", productId);

      // Upload additional images if any
      if (additionalImages.length > 0) {
        console.log("Starting upload of additional images...");
        try {
          await ImageUploadService.uploadAdditionalImages(
            productId,
            additionalImages
          );
          console.log("All additional images uploaded successfully");
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

    // Update logic (chỉ gửi fields thay đổi)
    const request: Partial<UpdateProductRequest> = {};
    let brandId = data.brandId;
    let subCategoryId = data.subCategoryId;

    if (formData.productName !== data.productName) {
      request.productName = formData.productName;
    }
    if (formData.price !== data.price) {
      request.price = formData.price;
    }
    if (formData.stockQuantity !== data.stockQuantity) {
      request.stockQuantity = formData.stockQuantity;
    }
    if (formData.description !== data.description) {
      request.description = formData.description;
    }
    if (formData.status !== data.status) {
      request.status = formData.status;
    }
    if (formData.warrantyPeriod !== data.warrantyPeriod) {
      request.warrantyPeriod = formData.warrantyPeriod;
    }
    if (formData.brandId !== data.brandId) {
      brandId = formData.brandId;
    }
    if (formData.subCategoryId !== data.subCategoryId) {
      subCategoryId = formData.subCategoryId;
    }

    if (
      Object.keys(request).length > 0 ||
      thumbnail ||
      formData.brandId !== data.brandId ||
      formData.subCategoryId !== data.subCategoryId
    ) {
      await productService.update(
        data.id,
        request as UpdateProductRequest,
        thumbnail || undefined,
        brandId,
        subCategoryId
      );

      // Upload additional images if any
      if (additionalImages.length > 0) {
        console.log(
          "Starting upload of additional images for existing product..."
        );
        try {
          await ImageUploadService.uploadAdditionalImages(
            data.id,
            additionalImages
          );
          console.log("All additional images uploaded successfully");
        } catch (error) {
          console.error("Failed to upload some additional images:", error);
          toast.warning(
            "Sản phẩm đã cập nhật thành công nhưng có lỗi khi tải một số ảnh bổ sung"
          );
        }
      }

      toast.success("Cập nhật sản phẩm thành công");
    } else {
      toast.info("Không có thay đổi nào để cập nhật");
    }
  };

  return {
    loading,
    brands,
    subCategories,
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
