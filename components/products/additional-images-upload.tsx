"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AdditionalImagesUploadProps {
  additionalImages: File[];
  additionalImagesPreview: string[];
  onAdditionalImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function AdditionalImagesUpload({
  additionalImages,
  additionalImagesPreview,
  onAdditionalImagesChange,
  onRemoveImage,
}: AdditionalImagesUploadProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="additionalImages">
        Ảnh bổ sung (có thể chọn nhiều ảnh)
      </Label>
      <Input
        id="additionalImages"
        type="file"
        accept="image/*"
        multiple
        onChange={onAdditionalImagesChange}
      />
      <p className="text-xs text-muted-foreground">
        Bạn có thể chọn nhiều ảnh cùng lúc. Ảnh sẽ được tải lên sau khi tạo/cập
        nhật sản phẩm thành công.
      </p>
      {additionalImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Đã chọn {additionalImages.length} ảnh:
          </p>
          <div className="grid grid-cols-3 gap-3 max-h-40 overflow-y-auto">
            {additionalImages.map((file, index) => (
              <div key={index} className="relative group">
                {additionalImagesPreview[index] && (
                  <img
                    src={additionalImagesPreview[index]}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveImage(index)}
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
  );
}
