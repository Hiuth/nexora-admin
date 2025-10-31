"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttributesResponse } from "@/types";

interface AttributeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  attributes: AttributesResponse[];
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function AttributeSelect({
  value,
  onValueChange,
  attributes,
  disabled = false,
  error,
  placeholder = "Chọn thuộc tính",
  label = "Thuộc tính",
  required = false,
}: AttributeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="attributeId">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id="attributeId">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {attributes.map((attribute) => (
            <SelectItem key={attribute.id} value={attribute.id}>
              {attribute.attributeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
