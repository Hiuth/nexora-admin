"use client";

import { toast } from "sonner";
import { productImgService } from "@/lib/api";

export class ImageUploadService {
  static async uploadAdditionalImages(
    productId: string,
    additionalImages: File[]
  ): Promise<void> {
    try {
      for (let i = 0; i < additionalImages.length; i++) {
        const image = additionalImages[i];
        console.log(
          `Uploading additional image ${i + 1}/${additionalImages.length}:`,
          image.name
        );
        const response = await productImgService.create(productId, image);
        console.log(`Upload response for image ${i + 1}:`, response);

        if (response.code !== 1000) {
          throw new Error(`Failed to upload image ${image.name}`);
        }
      }
      toast.success(
        `Đã tải lên ${additionalImages.length} ảnh bổ sung thành công`
      );
    } catch (error) {
      console.error("Error uploading additional images:", error);
      toast.error("Có lỗi khi tải ảnh bổ sung");
      throw error;
    }
  }

  static createImagePreview(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  static async createMultipleImagePreviews(files: File[]): Promise<string[]> {
    const previews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const preview = await this.createImagePreview(files[i]);
      previews[i] = preview;
    }
    return previews;
  }
}
