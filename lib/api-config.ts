// API Configuration - Single source of truth
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7098/api",
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: "/Auth/login",
    LOGOUT: "/Auth/logout",
    SEND_OTP_FORGOT_PASSWORD: "/Auth/send-otp-forgot-password",
    RESET_PASSWORD: "/Auth/reset-password",

    // Category endpoints
    CATEGORY: {
      GET_ALL: "/Category/getAll",
      GET_BY_ID: "/Category/getById",
      CREATE: "/Category/create",
      UPDATE: "/Category/update",
      DELETE: "/Category/delete",
    },

    // Other entities endpoints
    BRAND: {
      GET_ALL: "/Brand/getAll",
      GET_BY_ID: "/Brand/getById",
      CREATE: "/Brand/create",
      UPDATE: "/Brand/update",
      DELETE: "/Brand/delete",
    },

    SUBCATEGORY: {
      GET_ALL: "/SubCategory/getAll",
      GET_BY_ID: "/SubCategory/getById",
      CREATE: "/SubCategory/create",
      UPDATE: "/SubCategory/update",
      DELETE: "/SubCategory/delete",
    },

    PRODUCT: {
      GET_ALL: "/Product/getAll",
      GET_BY_ID: "/Product/getById",
      GET_BY_BRAND_ID: "/Product/getByBrandId",
      GET_BY_SUBCATEGORY_ID: "/Product/getBysubCategoryId",
      SEARCH: "/Product/searchProduct",
      GET_BY_PRICE_RANGE: "/Product/getByPriceRange",
      CREATE: "/Product/create",
      UPDATE: "/Product/update",
      DELETE: "/Product/delete",
    },

    ORDER: {
      GET_ALL: "/Order/getAll",
      GET_BY_ID: "/Order/getById",
      GET_BY_ACCOUNT_ID: "/Order/getByAccountId",
      CREATE: "/Order/create",
      UPDATE: "/Order/update",
      DELETE: "/Order/delete",
    },

    PC_BUILD: {
      GET_ALL: "/PcBuild/getAll",
      GET_BY_ID: "/PcBuild/getById",
      CREATE: "/PcBuild/create",
      UPDATE: "/PcBuild/update",
      DELETE: "/PcBuild/delete",
    },

    WARRANTY: {
      GET_ALL: "/Warranty/getAll",
      GET_BY_ID: "/Warranty/getById",
      CREATE: "/Warranty/create",
      UPDATE: "/Warranty/update",
      DELETE: "/Warranty/delete",
    },

    ACCOUNT: {
      GET_ALL: "/Account/getAll",
      GET_BY_ID: "/Account/getById",
      GET_BY_EMAIL: "/Account/getByEmail",
      GET_BY_PHONE: "/Account/getByPhone",
      CREATE: "/Account/create",
      UPDATE: "/Account/update",
      DELETE: "/Account/delete",
    },

    ATTRIBUTES: {
      GET_ALL: "/Attribute/getAll",
      GET_BY_ID: "/Attribute/getById",
      GET_BY_CATEGORY_ID: "/Attribute/getByCategoryId",
      CREATE: "/Attribute/create",
      UPDATE: "/Attribute/update",
      DELETE: "/Attribute/delete",
    },

    PRODUCT_ATTRIBUTE: {
      GET_BY_PRODUCT_ID: "/ProductAttribute/getByProductId",
      CREATE: "/ProductAttribute/create",
      UPDATE: "/ProductAttribute/update",
      DELETE: "/ProductAttribute/delete",
    },

    PRODUCT_UNIT: {
      GET_ALL: "/ProductUnit/getAll",
      GET_BY_ID: "/ProductUnit/getById",
      CREATE: "/ProductUnit/create",
      UPDATE: "/ProductUnit/update",
      DELETE: "/ProductUnit/delete",
    },

    PRODUCT_IMG: {
      CREATE: "/ProductImg/create",
      GET_BY_PRODUCT_ID: "/ProductImg/getAllByProductId",
      DELETE: "/ProductImg/delete",
    },
  },
} as const;

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get full endpoint URL
export const getApiEndpoint = (endpoint: string): string => {
  return buildApiUrl(endpoint);
};
