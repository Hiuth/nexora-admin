"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PcBuildAdditionalImagesUploadProps {
  additionalImages: File[];
  additionalImagesPreview: string[];
  onAdditionalImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function PcBuildAdditionalImagesUpload({
  additionalImages,
  additionalImagesPreview,
  onAdditionalImagesChange,
  onRemoveImage,
}: PcBuildAdditionalImagesUploadProps) {
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
        nhật PC Build thành công.
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
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}