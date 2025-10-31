"use client";

import { AttributeSelect } from "./attribute-select";
import { AttributeValueInput } from "./attribute-value-input";
import { AttributesResponse } from "@/types";

interface ProductAttributeFormFieldsProps {
  attributeId: string;
  onAttributeIdChange: (value: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  attributes: AttributesResponse[];
  disabled?: boolean;
  disableAttributeSelect?: boolean;
  errors?: {
    attributeId?: string;
    value?: string;
  };
}

export function ProductAttributeFormFields({
  attributeId,
  onAttributeIdChange,
  value,
  onValueChange,
  attributes,
  disabled = false,
  disableAttributeSelect = false,
  errors = {},
}: ProductAttributeFormFieldsProps) {
  return (
    <div className="space-y-4">
      <AttributeSelect
        value={attributeId}
        onValueChange={onAttributeIdChange}
        attributes={attributes}
        disabled={disabled || disableAttributeSelect}
        error={errors.attributeId}
        required
      />

      <AttributeValueInput
        value={value}
        onChange={onValueChange}
        disabled={disabled}
        error={errors.value}
        required
      />
    </div>
  );
}
