"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ThumbnailUploadProps {
  thumbnailPreview: string | null;
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export function ThumbnailUpload({
  thumbnailPreview,
  onThumbnailChange,
  required = false,
}: ThumbnailUploadProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="thumbnail">Ảnh thumbnail</Label>
      <Input
        id="thumbnail"
        type="file"
        accept="image/*"
        onChange={onThumbnailChange}
        required={required}
      />
      {thumbnailPreview && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <img
            src={thumbnailPreview}
            alt="Thumbnail preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-border"
          />
        </div>
      )}
    </div>
  );
}
