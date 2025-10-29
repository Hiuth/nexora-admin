// Request types for API calls

// Account request types
export interface CreateAccountRequest {
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string;
  accountImg?: string;
}

export interface UpdateAccountRequest {
  userName?: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  gender?: string;
  accountImg?: string;
}

// Category request types
export interface CreateCategoryRequest {
  categoryName: string;
  iconImg?: string;
}

export interface UpdateCategoryRequest {
  categoryName?: string;
  iconImg?: string;
}

// SubCategory request types
export interface CreateSubCategoryRequest {
  subCategoryName: string;
  subCategoryImg?: string;
  description?: string;
  categoryId: string;
}

export interface UpdateSubCategoryRequest {
  subCategoryName?: string;
  subCategoryImg?: string;
  description?: string;
  categoryId?: string;
}

// Brand request types
export interface CreateBrandRequest {
  brandName: string;
  categoryId: string;
}

export interface UpdateBrandRequest {
  brandName?: string;
  categoryId?: string;
}

// Attributes request types
export interface CreateAttributeRequest {
  attributeName: string;
  categoryId: string;
}

export interface UpdateAttributeRequest {
  attributeName?: string;
  categoryId?: string;
}

// Product request types
export interface CreateProductRequest {
  productName: string;
  price: number;
  stockQuantity: number;
  description?: string;
  thumbnail?: string;
  status: string;
  brandId: string;
  subCategoryId: string;
  warrantyPeriod: number;
}

export interface UpdateProductRequest {
  productName?: string;
  price?: number;
  stockQuantity?: number;
  description?: string;
  thumbnail?: string;
  status?: string;
  brandId?: string;
  subCategoryId?: string;
  warrantyPeriod?: number;
}

// Product Attribute request types
export interface CreateProductAttributeRequest {
  productId: string;
  attributeId: string;
  value: string;
}

export interface UpdateProductAttributeRequest {
  value?: string;
}

// Product Unit request types
export interface CreateProductUnitRequest {
  productId: string;
  imei?: string;
  serialNumber?: string;
  status: string;
}

export interface UpdateProductUnitRequest {
  imei?: string;
  serialNumber?: string;
  status?: string;
}

// Cart request types
export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

// Order request types
export interface CreateOrderRequest {
  accountId: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  orderDetails: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateOrderRequest {
  status?: string;
  customerName?: string;
  phoneNumber?: string;
  address?: string;
}

// PC Build request types
export interface CreatePcBuildRequest {
  productName: string;
  price: number;
  description?: string;
  status: string;
  thumbnail: string;
  subCategoryId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdatePcBuildRequest {
  productName?: string;
  price?: number;
  description?: string;
  status?: string;
  thumbnail?: string;
  subCategoryId?: string;
}

// Warranty request types
export interface CreateWarrantyRequest {
  productId: string;
  orderId: string;
  productUnitId: string;
  startDate: Date;
  warrantyPeriod: number;
}

export interface UpdateWarrantyRequest {
  status?: string;
  endDate?: Date;
}
