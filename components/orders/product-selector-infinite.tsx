"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Search,
  Filter,
  Package2,
  ShoppingCart,
  CheckCircle2,
  Box,
  Tag,
} from "lucide-react";
import { ProductResponse, BrandResponse, SubCategoryResponse } from "@/types";
import { useProductsInfinite } from "@/hooks/use-products-infinite";
import { brandService, subCategoryService } from "@/lib/api";
import { CartItem } from "./create-order-cart";
import { debounce } from "@/lib/utils";

interface ProductSelectorInfiniteProps {
  selectedProduct: ProductResponse | null;
  onSelectProduct: (product: ProductResponse) => void;
  cartItems: CartItem[];
  loading?: boolean;
}

export function ProductSelectorInfinite({
  selectedProduct,
  onSelectProduct,
  cartItems,
  loading = false,
}: ProductSelectorInfiniteProps) {
  // Infinite scroll hook
  const {
    products,
    loading: productsLoading,
    loadingMore,
    hasMore,
    totalItems,
    fetchProducts,
    loadMoreProducts,
    reset,
  } = useProductsInfinite();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Data states
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);

  // Intersection observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useRef<HTMLDivElement | null>(null);

  // Setup intersection observer
  const lastProductCallbackRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMoreProducts();
      }
    }, {
      threshold: 0.1,
    });
    if (node) {
      observerRef.current.observe(node);
      lastProductElementRef.current = node;
    }
  }, [loadingMore, hasMore, loadMoreProducts]);

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Debounced search
  const debouncedFetchProducts = useCallback(
    debounce((search: string, brand: string, subCategory: string) => {
      setSearchLoading(true);
      reset();
      setTimeout(() => {
        fetchProducts({
          search: search || undefined,
          brandId: brand && brand !== 'all' ? brand : undefined,
          subCategoryId: subCategory && subCategory !== 'all' ? subCategory : undefined,
        }).finally(() => {
          setSearchLoading(false);
        });
      }, 100);
    }, 500),
    [reset, fetchProducts]
  );

  // Load initial data
  useEffect(() => {
    loadBrands();
    loadSubCategories();
    fetchProducts();
  }, []);

  // Trigger search when filters change
  useEffect(() => {
    debouncedFetchProducts(searchTerm, selectedBrand, selectedSubCategory);
  }, [searchTerm, selectedBrand, selectedSubCategory, debouncedFetchProducts]);

  const loadBrands = async () => {
    try {
      const response = await brandService.getAll();
      if (response.code === 1000 && response.result) {
        setBrands(response.result);
      }
    } catch (error) {
      console.error("Failed to load brands:", error);
    }
  };

  const loadSubCategories = async () => {
    try {
      const response = await subCategoryService.getAll();
      if (response.code === 1000 && response.result) {
        setSubCategories(response.result);
      }
    } catch (error) {
      console.error("Failed to load subcategories:", error);
    }
  };

  // Filter products that are already in cart
  const availableProducts = products.filter(
    (product) => !cartItems.some((item) => item.product.id === product.id)
  );

  // Check if product is in cart
  const isProductInCart = (productId: string) => {
    return cartItems.some((item) => item.product.id.toString() === productId);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          {searchLoading && searchTerm ? (
            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          )}
          <Input
            placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 transition-all duration-200 ${
              searchLoading && searchTerm 
                ? 'bg-blue-50 border-blue-200 focus:border-blue-400' 
                : ''
            }`}
            disabled={loading}
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Sản phẩm khả dụng ({availableProducts.length}/{totalItems})
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary/10" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Brand Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Thương hiệu</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.brandName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SubCategory Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Danh mục con</Label>
              <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục con" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {subCategories.map((subCat) => (
                    <SelectItem key={subCat.id} value={subCat.id.toString()}>
                      {subCat.subCategoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Product List with Infinite Scroll */}
      <ScrollArea className="h-80 border rounded-md">
        <div className="p-4 space-y-3">
          {productsLoading && availableProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-400 rounded-full animate-spin"></div>
                <Package2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-muted-foreground">Đang tải sản phẩm...</p>
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Box className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Không tìm thấy sản phẩm phù hợp" : "Không có sản phẩm nào khả dụng"}
              </p>
            </div>
          ) : (
            availableProducts.map((product, index) => {
              const isLast = index === availableProducts.length - 1;
              const inCart = isProductInCart(product.id);
              
              return (
                <Card
                  key={product.id}
                  ref={isLast ? lastProductCallbackRef : undefined}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedProduct?.id === product.id
                      ? "ring-2 ring-blue-500 bg-blue-50 shadow-md"
                      : inCart
                      ? "bg-gray-50 border-gray-300 opacity-60"
                      : "hover:bg-blue-50 border-blue-200"
                  }`}
                  onClick={() => !inCart && onSelectProduct(product)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Product Thumbnail */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Package2 className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm truncate mb-1">
                              {product.productName}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              Mã: {product.id}
                            </p>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {product.price.toLocaleString("vi-VN")} ₫
                              </Badge>
                              <Badge
                                variant={product.stockQuantity > 0 ? "default" : "destructive"}
                                className="text-xs"
                              >
                                SL: {product.stockQuantity}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                              {product.brandName && (
                                <Badge variant="outline" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {product.brandName}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Status Indicator */}
                          <div className="flex-shrink-0 ml-3">
                            {inCart ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                <span className="text-xs">Trong giỏ</span>
                              </div>
                            ) : selectedProduct?.id === product.id ? (
                              <div className="flex items-center text-blue-600">
                                <div className="h-4 w-4 rounded-full bg-blue-600 mr-1"></div>
                                <span className="text-xs">Đã chọn</span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}

          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="text-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Đang tải thêm sản phẩm...</p>
            </div>
          )}

          {/* End of List */}
          {!hasMore && availableProducts.length > 0 && (
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">Đã tải tất cả sản phẩm</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}