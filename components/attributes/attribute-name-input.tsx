"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AttributeNameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function AttributeNameInput({
  value,
  onChange,
  disabled = false,
  error,
  placeholder = "Ví dụ: Màu sắc, Kích thước...",
  label = "Tên thuộc tính",
  required = false,
}: AttributeNameInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="attributeName">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id="attributeName"
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
