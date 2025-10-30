"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ProductResponse, ProductImgResponse } from "@/types";
import { productImgService } from "@/lib/api";
import Image from "next/image";

interface EditModeImageUploadProps {
  product: ProductResponse;
  thumbnailPreview: string | null;
  additionalImages: File[];
  additionalImagesPreview: string[];
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdditionalImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveNewImage: (index: number) => void;
}

export function EditModeImageUpload({
  product,
  thumbnailPreview,
  additionalImages,
  additionalImagesPreview,
  onThumbnailChange,
  onAdditionalImagesChange,
  onRemoveNewImage,
}: EditModeImageUploadProps) {
  const [existingImages, setExistingImages] = useState<ProductImgResponse[]>(
    []
  );
  const [loadingExistingImages, setLoadingExistingImages] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  useEffect(() => {
    loadExistingImages();
  }, [product.id]);

  const loadExistingImages = async () => {
    try {
      setLoadingExistingImages(true);
      const response = await productImgService.getByProductId(product.id);

      if (response.code === 1000 && response.result) {
        setExistingImages(response.result);
      } else {
        setExistingImages([]);
      }
    } catch (error) {
      console.error("Error loading existing images:", error);
      setExistingImages([]);
      toast.error("Không thể tải ảnh hiện có");
    } finally {
      setLoadingExistingImages(false);
    }
  };

  const handleDeleteExistingImage = async (imageId: string) => {
    try {
      setDeletingImageId(imageId);
      const response = await productImgService.delete(imageId);

      if (response.code === 1000) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Đã xóa ảnh thành công");
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Không thể xóa ảnh");
    } finally {
      setDeletingImageId(null);
    }
  };

  return (
    <>
      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Ảnh thumbnail</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={onThumbnailChange}
        />

        {/* Current thumbnail */}
        <div className="grid grid-cols-2 gap-4">
          {product.thumbnail && (
            <div>
              <p className="text-sm font-medium mb-2">Ảnh hiện tại:</p>
              <img
                src={product.thumbnail}
                alt="Current thumbnail"
                className="w-32 h-32 object-cover rounded-lg border-2 border-border"
              />
            </div>
          )}

          {/* New thumbnail preview */}
          {thumbnailPreview && (
            <div>
              <p className="text-sm font-medium mb-2">Ảnh mới:</p>
              <img
                src={thumbnailPreview}
                alt="New thumbnail preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-primary"
              />
            </div>
          )}
        </div>
      </div>

      {/* Existing Additional Images */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <Label>Ảnh bổ sung hiện có ({existingImages.length})</Label>
          {loadingExistingImages ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2 text-xs">
                Đang tải ảnh...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 max-h-40 overflow-y-auto">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.imgUrl}
                    alt="Existing image"
                    className="w-full h-20 object-cover rounded border"
                  />

                  {/* Delete button */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteExistingImage(img.id)}
                      disabled={deletingImageId === img.id}
                      className="h-6 w-6 p-0"
                    >
                      {deletingImageId === img.id ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <X size={12} />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Additional Images Upload */}
      <div className="space-y-2">
        <Label htmlFor="additionalImages">
          Thêm ảnh bổ sung mới (có thể chọn nhiều ảnh)
        </Label>
        <Input
          id="additionalImages"
          type="file"
          accept="image/*"
          multiple
          onChange={onAdditionalImagesChange}
        />
        <p className="text-xs text-muted-foreground">
          Bạn có thể chọn nhiều ảnh cùng lúc. Ảnh mới sẽ được tải lên sau khi
          cập nhật sản phẩm thành công.
        </p>

        {/* New images preview */}
        {additionalImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Ảnh mới đã chọn ({additionalImages.length}):
            </p>
            <div className="grid grid-cols-3 gap-3 max-h-40 overflow-y-auto">
              {additionalImages.map((file, index) => (
                <div key={index} className="relative group">
                  {additionalImagesPreview[index] && (
                    <img
                      src={additionalImagesPreview[index]}
                      alt={`New preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border border-primary"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveNewImage(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
