"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryResponse } from "@/types";

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  categories: CategoryResponse[];
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function CategorySelect({
  value,
  onValueChange,
  categories,
  disabled = false,
  error,
  placeholder = "Chọn danh mục",
  label = "Danh mục",
  required = false,
}: CategorySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="categoryId">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id="categoryId">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.categoryName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
