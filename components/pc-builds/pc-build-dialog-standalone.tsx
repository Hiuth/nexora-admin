"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import { PcBuildResponse, DialogMode } from "@/types";
import { usePcBuildFormStandalone } from "./use-pc-build-form-standalone";

interface PcBuildDialogStandaloneProps {
  open: boolean;
  mode: DialogMode;
  data?: PcBuildResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export function PcBuildDialogStandalone({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: PcBuildDialogStandaloneProps) {
  const {
    loading,
    categories,
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
  } = usePcBuildFormStandalone({
    open,
    mode,
    data,
    onSubmit,
    onClose,
  });

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleThumbnailChange(event);
  };

  const handleAdditionalImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleAdditionalImagesChange(event);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo PC Build mới" : "Chỉnh sửa PC Build"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Product Name */}
          <div>
            <Label htmlFor="productName">Tên PC Build *</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => handleFormDataChange("productName", e.target.value)}
              placeholder="Nhập tên PC Build"
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label>Danh mục *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => {
                handleFormDataChange("categoryId", value);
                // Reset subcategory when category changes
                handleFormDataChange("subCategoryId", "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SubCategory */}
          {formData.categoryId && (
            <div>
              <Label>Danh mục con</Label>
              <Select
                value={formData.subCategoryId}
                onValueChange={(value) => handleFormDataChange("subCategoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục con" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Không chọn</SelectItem>
                  {subCategories.map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id}>
                      {subCategory.subCategoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price */}
          <div>
            <Label htmlFor="price">Giá *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleFormDataChange("price", parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFormDataChange("description", e.target.value)}
              placeholder="Nhập mô tả PC Build"
              rows={3}
            />
          </div>

          {/* Status */}
          <div>
            <Label>Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleFormDataChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Thumbnail */}
          <div>
            <Label>Ảnh thumbnail {mode === "create" && "*"}</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("thumbnail-upload")?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Chọn ảnh thumbnail
                </Button>
                {thumbnail && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const event = { target: { files: null } } as any;
                      handleThumbnailChange(event);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
              {thumbnailPreview && (
                <div className="w-32 h-32 border rounded-lg overflow-hidden">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Images */}
          <div>
            <Label>Ảnh bổ sung (tùy chọn)</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("additional-images-upload")?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Chọn ảnh bổ sung ({additionalImages.length})
                </Button>
                {additionalImages.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const event = { target: { files: [] } } as any;
                      handleAdditionalImagesChange(event);
                    }}
                  >
                    <X className="h-4 w-4" /> Xóa tất cả
                  </Button>
                )}
              </div>
              <input
                id="additional-images-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesUpload}
                className="hidden"
              />
              {additionalImagesPreview.length > 0 && (
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                  {additionalImagesPreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Additional image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-1 -right-1 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "create" ? "Tạo" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}