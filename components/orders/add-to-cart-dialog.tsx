"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductResponse } from "@/types";
import { Loader2, ShoppingCart, X } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { brandService, subCategoryService } from "@/lib/api";
import { CartItem } from "./create-order-cart";
import { ProductSearchFilters } from "./product-search-filters";
import { ProductList } from "./product-list";
import { ProductConfiguration } from "./product-configuration";

interface AddToCartDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (item: Omit<CartItem, "id">) => void;
  cartItems: CartItem[];
  loading?: boolean;
}

export function AddToCartDialog({
  isOpen,
  onOpenChange,
  onAddToCart,
  cartItems,
  loading = false,
}: AddToCartDialogProps) {
  // Hooks
  const { products, loading: productsLoading, fetchProducts } = useProducts();

  // State
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [brands, setBrands] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  // UI states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load data on component mount
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      loadBrands();
      loadSubCategories();
    }
  }, [isOpen]);

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

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct(null);
      setQuantity(1);
      setUnitPrice(0);
      setSearchTerm("");
      setSelectedBrand("all");
      setSelectedSubCategory("all");
      setErrors({});
    }
  }, [isOpen]);

  // Update price when product changes
  useEffect(() => {
    if (selectedProduct) {
      setUnitPrice(selectedProduct.price);
    }
  }, [selectedProduct]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product: ProductResponse) => {
      // Exclude products already in cart
      const isInCart = cartItems.some((item) => item.product.id === product.id);
      if (isInCart) return false;

      const matchesSearch =
        searchTerm === "" ||
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brandName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand =
        selectedBrand === "all" ||
        selectedBrand === "" ||
        product.brandName === selectedBrand;
      const matchesSubCategory =
        selectedSubCategory === "all" ||
        selectedSubCategory === "" ||
        product.subCategoryName === selectedSubCategory;

      return matchesSearch && matchesBrand && matchesSubCategory;
    });
  }, [products, searchTerm, selectedBrand, selectedSubCategory, cartItems]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedProduct) {
      newErrors.product = "Vui lòng chọn sản phẩm";
    }

    if (quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (selectedProduct && quantity > selectedProduct.stockQuantity) {
      newErrors.quantity = `Chỉ còn ${selectedProduct.stockQuantity} sản phẩm trong kho`;
    }

    if (unitPrice <= 0) {
      newErrors.unitPrice = "Đơn giá phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!validateForm() || !selectedProduct) return;

    const cartItem: Omit<CartItem, "id"> = {
      product: selectedProduct,
      quantity,
      unitPrice,
    };

    onAddToCart(cartItem);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setUnitPrice(0);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-400 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            Thêm Sản Phẩm Vào Giỏ Hàng
          </DialogTitle>
          <DialogDescription className="text-base text-blue-600">
            Chọn sản phẩm từ danh sách bên trái và cấu hình chi tiết bên phải
          </DialogDescription>
        </DialogHeader>

        {/* Content Area - 2 Columns Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Product Search & List */}
          <div className="flex flex-col space-y-4 overflow-hidden">
            {/* Search & Filters */}
            <ProductSearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              selectedSubCategory={selectedSubCategory}
              onSubCategoryChange={setSelectedSubCategory}
              brands={brands}
              subCategories={subCategories}
              filteredCount={filteredProducts.length}
              cartCount={cartItems.length}
            />

            {/* Product List */}
            <div className="flex-1 overflow-hidden">
              <ProductList
                products={filteredProducts}
                loading={productsLoading}
                selectedProduct={selectedProduct}
                onSelectProduct={setSelectedProduct}
                cartItems={cartItems}
              />
            </div>
          </div>

          {/* Right Column - Product Configuration */}
          <div className="flex flex-col space-y-4 overflow-hidden">
            <ProductConfiguration
              selectedProduct={selectedProduct}
              quantity={quantity}
              onQuantityChange={setQuantity}
              unitPrice={unitPrice}
              onUnitPriceChange={setUnitPrice}
              loading={loading}
              errors={errors}
            />

            {/* Error Display for no product selected */}
            {errors.product && (
              <div className="border-2 border-red-300 bg-red-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-red-700 font-medium text-sm">
                    {errors.product}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 bg-blue-50 border-t-2 border-blue-200 -mx-6 -mb-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedProduct && (
                <div className="text-sm text-blue-600">
                  <span className="font-medium">Đã chọn:</span>{" "}
                  <span className="text-blue-700 font-bold">
                    {selectedProduct.productName}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2 border-2 border-blue-200 hover:bg-blue-50"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={loading || !selectedProduct || quantity <= 0}
                className="px-8 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <ShoppingCart className="mr-2 h-4 w-4" />
                Thêm Vào Giỏ Hàng
                {selectedProduct && quantity > 0 && (
                  <Badge className="ml-2 bg-white text-blue-600 font-bold">
                    {quantity}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
