"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AttributeValueInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function AttributeValueInput({
  value,
  onChange,
  disabled = false,
  error,
  placeholder = "Ví dụ: Đỏ, 32GB, 15.6 inch...",
  label = "Giá trị",
  required = false,
}: AttributeValueInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="attributeValue">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id="attributeValue"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
