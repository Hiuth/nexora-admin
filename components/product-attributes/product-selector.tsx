"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductResponse, CategoryResponse } from "@/types";
import { productService, categoryService } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface ProductSelectorProps {
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  disabled?: boolean;
}

export function ProductSelector({
  selectedProductId,
  onProductSelect,
  disabled = false,
}: ProductSelectorProps) {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load categories and products
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load categories
        const categoriesResponse = await categoryService.getAll();
        if (categoriesResponse.code === 1000 && categoriesResponse.result) {
          setCategories(categoriesResponse.result);
        }

        // Load all products
        const productsResponse = await productService.getAll();
        console.log("Products API response:", productsResponse); // Debug log

        if (productsResponse.code === 1000 && productsResponse.result) {
          const paginatedData = productsResponse.result;
          const productList = (paginatedData as any).items || [];
          setAllProducts(productList);
          setProducts(productList); // Initially show all products
        } else {
          console.warn(
            "Products API returned unexpected structure:",
            productsResponse.result
          );
          setAllProducts([]);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setAllProducts([]);
        setProducts([]);
        setCategories([]);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter products based on selected category
  useEffect(() => {
    if (selectedCategoryId && selectedCategoryId !== "all") {
      const filteredByCategory = allProducts.filter(
        (product) => product.categoryId === selectedCategoryId
      );
      setProducts(filteredByCategory);
    } else {
      setProducts(allProducts);
    }
    // Reset selected product when category changes
    onProductSelect("");
  }, [selectedCategoryId, allProducts, onProductSelect]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSearchTerm(""); // Reset search when category changes
  };

  // Filter products based on search term
  const filteredProducts = Array.isArray(products)
    ? products.filter(
        (product) =>
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const selectedProduct = Array.isArray(products)
    ? products.find((p) => p.id === selectedProductId)
    : undefined;

  return (
    <div className="space-y-4">
      {/* Category Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Chọn danh mục</label>
        <Select
          value={selectedCategoryId}
          onValueChange={handleCategoryChange}
          disabled={disabled || loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục để lọc sản phẩm">
              {selectedCategoryId && selectedCategoryId !== "all" && (
                <span>
                  {
                    categories.find((c) => c.id === selectedCategoryId)
                      ?.categoryName
                  }
                </span>
              )}
              {selectedCategoryId === "all" && <span>Tất cả danh mục</span>}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          disabled={disabled || loading}
        />
      </div>

      {/* Category Info */}
      {selectedCategoryId && selectedCategoryId !== "all" && (
        <div className="text-xs text-muted-foreground">
          Hiển thị {products.length} sản phẩm trong danh mục{" "}
          <span className="font-medium">
            {categories.find((c) => c.id === selectedCategoryId)?.categoryName}
          </span>
        </div>
      )}

      <Select
        value={selectedProductId}
        onValueChange={onProductSelect}
        disabled={disabled || loading}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              selectedCategoryId && selectedCategoryId !== "all"
                ? `Chọn sản phẩm từ ${
                    categories.find((c) => c.id === selectedCategoryId)
                      ?.categoryName || "danh mục đã chọn"
                  }`
                : "Chọn sản phẩm"
            }
          >
            {selectedProduct && (
              <div className="flex items-center gap-1 sm:gap-2 w-full">
                <span className="font-medium text-sm sm:text-base truncate flex-1">
                  {selectedProduct.productName}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ID: {selectedProduct.id}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              Đang tải...
            </SelectItem>
          ) : filteredProducts.length === 0 ? (
            <SelectItem value="no-results" disabled>
              {selectedCategoryId && selectedCategoryId !== "all"
                ? `Không có sản phẩm trong danh mục này`
                : "Không tìm thấy sản phẩm"}
            </SelectItem>
          ) : (
            filteredProducts.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                <div className="flex flex-col w-full">
                  <span className="font-medium text-sm sm:text-base truncate">
                    {product.productName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    ID: {product.id} • {product.brandName}
                  </span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {selectedProduct && (
        <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
          <h4 className="font-medium text-sm mb-2">Sản phẩm đã chọn:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <strong className="min-w-0 sm:min-w-[120px]">Tên:</strong>
              <span className="text-muted-foreground truncate">
                {selectedProduct.productName}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <strong className="min-w-0 sm:min-w-[120px]">Thương hiệu:</strong>
              <span className="text-muted-foreground">
                {selectedProduct.brandName}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <strong className="min-w-0 sm:min-w-[120px]">Danh mục:</strong>
              <span className="text-muted-foreground">
                {selectedProduct.categoryName}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <strong className="min-w-0 sm:min-w-[120px]">
                Danh mục phụ:
              </strong>
              <span className="text-muted-foreground">
                {selectedProduct.subCategoryName}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <strong className="min-w-0 sm:min-w-[120px]">Giá:</strong>
              <span className="text-muted-foreground font-medium">
                {selectedProduct.price.toLocaleString("vi-VN")} VND
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
