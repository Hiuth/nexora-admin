"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CategoryResponse,
  SubCategoryResponse,
  ProductResponse,
} from "@/types";
import { useCategories, useSubCategories, useProducts } from "@/hooks";

interface ProductSelectorProps {
  onProductSelect: (product: ProductResponse) => void;
  selectedProduct: ProductResponse | null;
}

export function ProductSelector({
  onProductSelect,
  selectedProduct,
}: ProductSelectorProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<string>("");

  const { categories, loading: categoriesLoading } = useCategories();
  const {
    subCategories,
    fetchSubCategories,
    loading: subCategoriesLoading,
  } = useSubCategories();
  const { products, fetchProducts, loading: productsLoading } = useProducts();

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId("");
    await fetchSubCategories(categoryId);
  };

  const handleSubCategoryChange = async (subCategoryId: string) => {
    setSelectedSubCategoryId(subCategoryId);
    await fetchProducts(undefined, subCategoryId);
  };

  const handleProductChange = (productId: string) => {
    if (!Array.isArray(products)) return;

    const product = products.find((p: ProductResponse) => p.id === productId);
    if (product) {
      onProductSelect(product);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn Sản Phẩm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Danh Mục</label>
          <Select
            onValueChange={handleCategoryChange}
            value={selectedCategoryId}
            disabled={categoriesLoading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  categoriesLoading ? "Đang tải..." : "Chọn danh mục"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(categories) && categories.length > 0
                ? categories.map((category: CategoryResponse) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </SelectItem>
                  ))
                : !categoriesLoading && (
                    <div className="p-2 text-sm text-muted-foreground">
                      Không có danh mục nào
                    </div>
                  )}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory Selection */}
        {selectedCategoryId && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Danh Mục Con
            </label>
            <Select
              onValueChange={handleSubCategoryChange}
              value={selectedSubCategoryId}
              disabled={subCategoriesLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    subCategoriesLoading ? "Đang tải..." : "Chọn danh mục con"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(subCategories) && subCategories.length > 0
                  ? subCategories.map((subCategory: SubCategoryResponse) => (
                      <SelectItem key={subCategory.id} value={subCategory.id}>
                        {subCategory.subCategoryName}
                      </SelectItem>
                    ))
                  : !subCategoriesLoading && (
                      <div className="p-2 text-sm text-muted-foreground">
                        Không có danh mục con nào
                      </div>
                    )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Product Selection */}
        {selectedSubCategoryId && (
          <div>
            <label className="text-sm font-medium mb-2 block">Sản Phẩm</label>
            <Select
              onValueChange={handleProductChange}
              value={selectedProduct?.id || ""}
              disabled={productsLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    productsLoading ? "Đang tải..." : "Chọn sản phẩm"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(products) && products.length > 0
                  ? products.map((product: ProductResponse) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{product.productName}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            Tồn kho: {product.stockQuantity}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  : !productsLoading && (
                      <div className="p-2 text-sm text-muted-foreground">
                        Không có sản phẩm nào
                      </div>
                    )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Selected Product Info */}
        {selectedProduct && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Sản Phẩm Đã Chọn</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Tên:</span>{" "}
                {selectedProduct.productName}
              </div>
              <div>
                <span className="text-muted-foreground">Tồn kho:</span>{" "}
                {selectedProduct.stockQuantity}
              </div>
              <div>
                <span className="text-muted-foreground">Thương hiệu:</span>{" "}
                {selectedProduct.brandName}
              </div>
              <div>
                <span className="text-muted-foreground">Giá:</span>{" "}
                {selectedProduct.price?.toLocaleString()} VNĐ
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
