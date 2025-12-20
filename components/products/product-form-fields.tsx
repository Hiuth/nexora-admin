"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandResponse, SubCategoryResponse, CategoryResponse } from "@/types";

// Utility functions for better search
const normalizeVietnameseText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
};

const calculateFuzzyScore = (query: string, target: string): number => {
  const normalizedQuery = normalizeVietnameseText(query.trim());
  const normalizedTarget = normalizeVietnameseText(target);
  
  if (normalizedQuery === "") return 1;
  if (normalizedTarget.includes(normalizedQuery)) {
    // Exact substring match gets highest score
    const startIndex = normalizedTarget.indexOf(normalizedQuery);
    if (startIndex === 0) return 10; // Starts with query
    return 8; // Contains query
  }
  
  // Check if all words in query exist in target
  const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
  const targetWords = normalizedTarget.split(/\s+/);
  
  let matchingWords = 0;
  for (const queryWord of queryWords) {
    for (const targetWord of targetWords) {
      if (targetWord.includes(queryWord) || queryWord.includes(targetWord)) {
        matchingWords++;
        break;
      }
    }
  }
  
  if (matchingWords === queryWords.length) return 6; // All words match
  if (matchingWords > 0) return 3; // Some words match
  
  // Fuzzy character matching
  let score = 0;
  let queryIndex = 0;
  for (let i = 0; i < normalizedTarget.length && queryIndex < normalizedQuery.length; i++) {
    if (normalizedTarget[i] === normalizedQuery[queryIndex]) {
      score++;
      queryIndex++;
    }
  }
  
  return queryIndex === normalizedQuery.length ? score / normalizedQuery.length : 0;
};

const highlightSearchText = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text;
  
  const normalizedQuery = normalizeVietnameseText(query.trim());
  const normalizedText = normalizeVietnameseText(text);
  
  const index = normalizedText.indexOf(normalizedQuery);
  if (index === -1) return text;
  
  // Find the actual positions in the original text
  let actualStart = 0;
  let normalizedPos = 0;
  
  for (let i = 0; i < text.length && normalizedPos < index; i++) {
    if (normalizeVietnameseText(text[i]) === normalizedText[normalizedPos]) {
      normalizedPos++;
    }
    if (normalizedPos < index) actualStart++;
  }
  
  let actualEnd = actualStart;
  normalizedPos = index;
  
  for (let i = actualStart; i < text.length && normalizedPos < index + normalizedQuery.length; i++) {
    if (normalizeVietnameseText(text[i]) === normalizedText[normalizedPos]) {
      normalizedPos++;
    }
    actualEnd++;
  }
  
  return (
    <>
      {text.substring(0, actualStart)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">
        {text.substring(actualStart, actualEnd)}
      </mark>
      {text.substring(actualEnd)}
    </>
  );
};

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
  isSerial: boolean;
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
  const [open, setOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  // Filter subcategories based on selected category
  const filteredSubCategories = subCategories.filter(
    (subCategory) => subCategory.categoryId === formData.categoryId
  );

  // Smart search and sort brands by relevance
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) {
      return [...brands].sort((a, b) => a.brandName.localeCompare(b.brandName));
    }
    
    return brands
      .map(brand => ({
        ...brand,
        score: calculateFuzzyScore(brandSearch, brand.brandName)
      }))
      .filter(brand => brand.score > 0)
      .sort((a, b) => b.score - a.score || a.brandName.localeCompare(b.brandName))
      .map(({ score, ...brand }) => brand);
  }, [brands, brandSearch]);

  // Get selected brand name for display
  const selectedBrand = brands.find((brand) => brand.id === formData.brandId);

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
            disabled={formData.isSerial}
          />
          {formData.isSerial && (
            <p className="text-xs text-muted-foreground">
              Sản phẩm có serial sẽ có số lượng = 0. Số lượng thực tế được quản
              lý thông qua các đơn vị sản phẩm.
            </p>
          )}
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedBrand ? selectedBrand.brandName : "Chọn thương hiệu"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Tìm thương hiệu... (hỗ trợ tìm kiếm không dấu)"
                  value={brandSearch}
                  onValueChange={setBrandSearch}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    {brandSearch.trim() ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        <div>Không tìm thấy thương hiệu phù hợp</div>
                        <div className="mt-1 text-xs">
                          Thử tìm kiếm với từ khóa khác hoặc không sử dụng dấu
                        </div>
                      </div>
                    ) : (
                      "Không có thương hiệu nào."
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredBrands.map((brand) => (
                      <CommandItem
                        key={brand.id}
                        value={brand.brandName} // Use brandName for better matching
                        onSelect={() => {
                          onFormDataChange({ brandId: brand.id });
                          setOpen(false);
                          setBrandSearch("");
                        }}
                        className="flex items-center gap-2 px-2 py-2"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            formData.brandId === brand.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span className="flex-1 truncate">
                          {highlightSearchText(brand.brandName, brandSearch)}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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

      <div className="grid grid-cols-2 gap-4">
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
          <Label className="text-sm font-medium">Quản lý Serial/IMEI</Label>
          <div className="flex items-center space-x-2 h-10">
            <Checkbox
              id="isSerial"
              checked={formData.isSerial}
              onCheckedChange={(checked) =>
                onFormDataChange({ isSerial: checked as boolean })
              }
            />
            <Label
              htmlFor="isSerial"
              className="text-sm font-medium leading-none"
            >
              Sản phẩm có số serial/IMEI
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Đánh dấu nếu sản phẩm này cần quản lý theo số serial hoặc IMEI
          </p>
        </div>
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
