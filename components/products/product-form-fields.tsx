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
import { BrandResponse, SubCategoryResponse, CategoryResponse } from "@/types";

interface ProductFormData {
  productName: string;
  price: number;
  stockQuantity: number;
  description: string;
  status: string;
  warrantyPeriod: number;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
}

interface ProductFormFieldsProps {
  formData: ProductFormData;
  brands: BrandResponse[];
  categories: CategoryResponse[];
  subCategories: SubCategoryResponse[];
  onFormDataChange: (data: Partial<ProductFormData>) => void;
}

export function ProductFormFields({
  formData,
  brands,
  categories,
  subCategories,
  onFormDataChange,
}: ProductFormFieldsProps) {
  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter(
    (subCategory) => subCategory.categoryId === formData.categoryId
  );

  // Handle category change - reset subcategory when category changes
  const handleCategoryChange = (categoryId: string) => {
    onFormDataChange({
      categoryId,
      subCategoryId: "", // Reset subcategory when category changes
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Tên sản phẩm</Label>
          <Input
            id="productName"
            value={formData.productName}
            onChange={(e) => onFormDataChange({ productName: e.target.value })}
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Giá</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              onFormDataChange({ price: Number(e.target.value) })
            }
            placeholder="0"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Số lượng</Label>
          <Input
            id="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={(e) =>
              onFormDataChange({ stockQuantity: Number(e.target.value) })
            }
            placeholder="0"
            required
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warrantyPeriod">Thời hạn bảo hành (tháng)</Label>
          <Input
            id="warrantyPeriod"
            type="number"
            value={formData.warrantyPeriod}
            onChange={(e) =>
              onFormDataChange({ warrantyPeriod: Number(e.target.value) })
            }
            placeholder="12"
            required
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brandId">Thương hiệu</Label>
          <Select
            value={formData.brandId}
            onValueChange={(value) => onFormDataChange({ brandId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.brandName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Danh mục</Label>
          <Select
            value={formData.categoryId}
            onValueChange={handleCategoryChange}
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
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subCategoryId">Danh mục con</Label>
          <Select
            value={formData.subCategoryId}
            onValueChange={(value) =>
              onFormDataChange({ subCategoryId: value })
            }
            disabled={!formData.categoryId}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  !formData.categoryId
                    ? "Vui lòng chọn danh mục trước"
                    : filteredSubCategories.length === 0
                    ? "Không có danh mục con"
                    : "Chọn danh mục con"
                }
              />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => onFormDataChange({ status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
            <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          placeholder="Nhập mô tả sản phẩm"
          rows={3}
        />
      </div>
    </>
  );
}

export type { ProductFormData };
