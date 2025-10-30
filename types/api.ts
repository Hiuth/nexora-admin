// API Response wrapper
export interface ApiResponse<T> {
  code: number;
  message: string;
  result?: T;
}

// Account types
export interface AccountResponse {
  id: string;
  userName: string;
  password: string;
  createdAt: Date;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  accountImg: string;
}

// Attributes types
export interface AttributesResponse {
  id: string;
  attributeName: string;
  categoryId: string;
}

// Brand types
export interface BrandResponse {
  id: string;
  brandName: string;
  categoryId: string;
}

// Cart types
export interface CartResponse {
  id: string;
  productId: string;
  quantity?: number;
  accountId: string;
  productName: string;
  thumbnail: string;
  price?: number;
  stockQuantity?: number;
}

// Category types
export interface CategoryResponse {
  id: string;
  categoryName: string;
  iconImg?: string;
}

// SubCategory types
export interface SubCategoryResponse {
  id: string;
  subCategoryName: string;
  subCategoryImg?: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
}

// Order types
export interface OrderResponse {
  id: string;
  orderDate: Date;
  status: string;
  accountId: string;
  totalAmount: number;
  CustomerName: string;
  phoneNumber: string;
  address: string;
}

export interface OrderDetailResponse {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  unitPrice: number;
}

// Product types
export interface ProductResponse {
  id: string;
  productName: string;
  price: number;
  stockQuantity: number;
  description?: string;
  thumbnail?: string;
  createdAt: Date;
  status: string;
  brandId: string;
  brandName: string;
  subCategoryId: string;
  subCategoryName: string;
  warrantyPeriod: number;
}

export interface ProductAttributeResponse {
  id: string;
  productId: string;
  attributeId: string;
  value: string;
  attributeName: string;
}

export interface ProductImgResponse {
  id: string;
  imgUrl: string;
  productId: string;
}

export interface ProductUnitResponse {
  id: string;
  productId: string;
  productName: string;
  imei?: string;
  serialNumber?: string;
  status: string;
  createdAt: Date;
}

// PC Build types
export interface PcBuildResponse {
  id: string;
  productName: string;
  price: number;
  description?: string;
  status: string;
  thumbnail: string;
  subCategoryId: string;
  subCategoryName: string;
}

export interface PcBuildItemResponse {
  id: string;
  pcBuildId: string;
  productId: string;
  quantity: number;
  productName: string;
  price: number;
  thumbnail: string;
}

// Warranty types
export interface WarrantyRecordResponse {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
  productId: string;
  productName: string;
  warrantyPeriod: number;
  orderId: string;
  productUnitId: string;
  serialNumber?: string;
  imei?: string;
}
