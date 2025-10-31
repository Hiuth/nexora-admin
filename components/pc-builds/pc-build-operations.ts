"use client";

import { toast } from "sonner";
import {
  CreatePcBuildRequest,
  UpdatePcBuildRequest,
  PcBuildResponse,
} from "@/types";
import { pcBuildService } from "@/lib/api";
import { ImageUploadService } from "../products/image-upload-service";
import { PcBuildFormData } from "./pc-build-form-fields";

export class PcBuildOperations {
  static async create(
    formData: PcBuildFormData,
    thumbnail: File,
    additionalImages: File[],
    onSuccess: () => void
  ): Promise<void> {
    if (!formData.categoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    const request: CreatePcBuildRequest = {
      productName: formData.productName,
      price: formData.price,
      description: formData.description,
      status: formData.status,
    };

    const pcBuildResponse = await pcBuildService.create(
      formData.categoryId,
      formData.subCategoryId || null,
      request,
      thumbnail
    );

    if (pcBuildResponse.code === 1000 && pcBuildResponse.result) {
      const pcBuildId = pcBuildResponse.result.id;
      console.log("PC Build created successfully with ID:", pcBuildId);

      // Upload additional images if any
      if (additionalImages.length > 0) {
        console.log("Starting upload of additional images...");
        try {
          await ImageUploadService.uploadAdditionalImages(
            pcBuildId,
            additionalImages
          );
          console.log("All additional images uploaded successfully");
        } catch (error) {
          console.error("Failed to upload some additional images:", error);
          toast.warning(
            "PC Build đã tạo thành công nhưng có lỗi khi tải một số ảnh bổ sung"
          );
        }
      }

      onSuccess();
      toast.success("Tạo PC Build thành công");
    } else {
      throw new Error("Failed to create PC Build");
    }
  }

  static async update(
    data: PcBuildResponse,
    formData: PcBuildFormData,
    thumbnail: File | null,
    additionalImages: File[],
    onSuccess: () => void
  ): Promise<void> {
    // Update logic (chỉ gửi fields thay đổi)
    const request: Partial<UpdatePcBuildRequest> = {};
    let categoryId = data.categoryId;
    let subCategoryId = data.subCategoryId;

    if (formData.productName !== data.productName) {
      request.productName = formData.productName;
    }
    if (formData.price !== data.price) {
      request.price = formData.price;
    }
    if (formData.description !== data.description) {
      request.description = formData.description;
    }
    if (formData.status !== data.status) {
      request.status = formData.status;
    }
    if (formData.categoryId !== data.categoryId) {
      categoryId = formData.categoryId;
    }
    if (formData.subCategoryId !== data.subCategoryId) {
      subCategoryId = formData.subCategoryId;
    }

    const hasFormChanges =
      Object.keys(request).length > 0 ||
      thumbnail ||
      formData.categoryId !== data.categoryId ||
      formData.subCategoryId !== data.subCategoryId;

    const hasNewImages = additionalImages.length > 0;

    if (hasFormChanges || hasNewImages) {
      // Update PC Build info if there are form changes
      if (hasFormChanges) {
        await pcBuildService.update(
          data.id,
          categoryId,
          subCategoryId,
          request as UpdatePcBuildRequest,
          thumbnail || undefined
        );
        console.log("PC Build updated successfully");
      }

      // Upload additional images if any (independent of form changes)
      if (hasNewImages) {
        console.log(
          "Starting upload of additional images for existing PC Build..."
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
            hasFormChanges
              ? "PC Build đã cập nhật thành công nhưng có lỗi khi tải một số ảnh bổ sung"
              : "Có lỗi khi tải ảnh bổ sung"
          );
        }
      }

      if (hasFormChanges && hasNewImages) {
        toast.success("Cập nhật PC Build và tải ảnh thành công");
      } else if (hasFormChanges) {
        toast.success("Cập nhật PC Build thành công");
      } else if (hasNewImages) {
        toast.success("Tải ảnh bổ sung thành công");
      }

      // Only call onSuccess when there are actual changes - consistent with product logic
      onSuccess();
    } else {
      toast.info("Không có thay đổi nào để cập nhật");
    }
  }
}
