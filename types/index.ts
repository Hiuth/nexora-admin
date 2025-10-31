import React from "react";

// Export all API types
export * from "./api";
export * from "./requests";

// Re-export utility functions
export * from "../lib/api-utils";

// Additional utility types
export type TableColumn<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
};

export type SortOrder = "asc" | "desc";

export type TableSort<T> = {
  field: keyof T;
  order: SortOrder;
};

export type PaginationConfig = {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
};

// Form types
export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "file";

export type FormField = {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: any;
};

// Dialog/Modal types
export type DialogMode = "create" | "edit" | "view";

export type DialogProps<T> = {
  open: boolean;
  mode: DialogMode;
  data?: T;
  onClose: () => void;
  onSubmit: (data: T) => void;
};

// Status types
export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type WarrantyStatus = "ACTIVE" | "EXPIRED" | "CLAIMED";
export type PcBuildStatus = "DRAFT" | "ACTIVE" | "INACTIVE";

// Filter types
export type FilterOptions = {
  search?: string;
  status?: string;
  category?: string;
  brand?: string;
  dateRange?: [Date, Date];
  priceRange?: [number, number];
};
