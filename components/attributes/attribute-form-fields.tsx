"use client";

import { CategorySelect } from "./category-select";
import { AttributeNameInput } from "./attribute-name-input";
import { CategoryResponse } from "@/types";

interface AttributeFormFieldsProps {
  attributeName: string;
  onAttributeNameChange: (value: string) => void;
  categoryId: string;
  onCategoryIdChange: (value: string) => void;
  categories: CategoryResponse[];
  disabled?: boolean;
  errors?: {
    attributeName?: string;
    categoryId?: string;
  };
}

export function AttributeFormFields({
  attributeName,
  onAttributeNameChange,
  categoryId,
  onCategoryIdChange,
  categories,
  disabled = false,
  errors = {},
}: AttributeFormFieldsProps) {
  return (
    <div className="space-y-4">
      <CategorySelect
        value={categoryId}
        onValueChange={onCategoryIdChange}
        categories={categories}
        disabled={disabled}
        error={errors.categoryId}
        required
      />

      <AttributeNameInput
        value={attributeName}
        onChange={onAttributeNameChange}
        disabled={disabled}
        error={errors.attributeName}
        required
      />
    </div>
  );
}
