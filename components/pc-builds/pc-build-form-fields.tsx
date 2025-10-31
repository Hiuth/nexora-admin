"use client";

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
import { CategoryResponse, SubCategoryResponse } from "@/types";

export interface PcBuildFormData {
  productName: string;
  price: number;
  description: string;
  status: string;
  categoryId: string;
  subCategoryId: string;
}

interface PcBuildFormFieldsProps {
  formData: PcBuildFormData;
  categories: CategoryResponse[];
  subCategories: SubCategoryResponse[];
  onFormDataChange: (newData: Partial<PcBuildFormData>) => void;
  isViewMode?: boolean;
}

export function PcBuildFormFields({
  formData,
  categories,
  subCategories,
  onFormDataChange,
  isViewMode = false,
}: PcBuildFormFieldsProps) {
  const handleCategoryChange = (categoryId: string) => {
    onFormDataChange({
      categoryId,
      subCategoryId: "", // Reset subcategory when category changes
    });
  };

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.categoryId === formData.categoryId
  );

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="categoryId">
          Danh mục <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.categoryId}
          onValueChange={handleCategoryChange}
          disabled={isViewMode}
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

      <div className="space-y-2">
        <Label htmlFor="subCategoryId">Danh mục con</Label>
        <Select
          value={formData.subCategoryId}
          onValueChange={(value) => onFormDataChange({ subCategoryId: value })}
          disabled={isViewMode || !formData.categoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục con (tùy chọn)" />
          </SelectTrigger>
          <SelectContent>
            {filteredSubCategories.map((subCategory) => (
              <SelectItem key={subCategory.id} value={subCategory.id}>
                {subCategory.subCategoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productName">
          Tên PC Build <span className="text-destructive">*</span>
        </Label>
        <Input
          id="productName"
          value={formData.productName}
          onChange={(e) => onFormDataChange({ productName: e.target.value })}
          placeholder="Nhập tên PC Build"
          required
          disabled={isViewMode}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">
          Giá (VNĐ) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => onFormDataChange({ price: Number(e.target.value) })}
          placeholder="Nhập giá"
          required
          disabled={isViewMode}
          min="0"
          step="1000"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          placeholder="Nhập mô tả cho PC Build"
          disabled={isViewMode}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => onFormDataChange({ status: value })}
          disabled={isViewMode}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Bản nháp</SelectItem>
            <SelectItem value="ACTIVE">Hoạt động</SelectItem>
            <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
