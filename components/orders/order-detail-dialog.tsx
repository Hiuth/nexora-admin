"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OrderDetailResponse,
  CreateOrderDetailRequest,
  ProductResponse,
} from "@/types";
import {
  Loader2,
  Package,
  Search,
  Filter,
  ShoppingCart,
  Star,
  Package2,
  Tag,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { brandService, subCategoryService } from "@/lib/api";

interface OrderDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSubmit: (
    orderId: string,
    productId: string,
    data: CreateOrderDetailRequest
  ) => Promise<boolean>;
  loading?: boolean;
}

export function OrderDetailDialog({
  isOpen,
  onOpenChange,
  orderId,
  onSubmit,
  loading = false,
}: OrderDetailDialogProps) {
  // Hooks
  const { products, loading: productsLoading, fetchProducts } = useProducts();

  // State
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    unitPrice: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [brands, setBrands] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  // UI states
  const [showFilters, setShowFilters] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      loadSubCategories();
      loadBrands();
    }
  }, [isOpen]);

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

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        productId: "",
        quantity: 1,
        unitPrice: 0,
      });
      setSelectedProduct(null);
      setErrors({});
      setSearchTerm("");
      setSelectedBrand("");
      setSelectedSubCategory("");
      setShowFilters(false);
    }
  }, [isOpen]);

  // Update product selection
  useEffect(() => {
    if (formData.productId) {
      const product = products.find(
        (p: ProductResponse) => p.id === formData.productId
      );
      if (product) {
        setSelectedProduct(product);
        setFormData((prev) => ({ ...prev, unitPrice: product.price }));
      }
    }
  }, [formData.productId, products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product: ProductResponse) => {
      const matchesSearch =
        searchTerm === "" ||
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brandName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand =
        selectedBrand === "" || product.brandName === selectedBrand;
      const matchesSubCategory =
        selectedSubCategory === "" ||
        product.subCategoryName === selectedSubCategory;

      return matchesSearch && matchesBrand && matchesSubCategory;
    });
  }, [products, searchTerm, selectedBrand, selectedSubCategory]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.productId) {
      newErrors.productId = "Vui lòng chọn sản phẩm";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = "Đơn giá phải lớn hơn 0";
    }

    // Check stock quantity
    if (selectedProduct && formData.quantity > selectedProduct.stockQuantity) {
      newErrors.quantity = `Chỉ còn ${selectedProduct.stockQuantity} sản phẩm trong kho`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(orderId, formData.productId, {
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
    });

    if (success) {
      setFormData({
        productId: "",
        quantity: 1,
        unitPrice: 0,
      });
      setSelectedProduct(null);
      setErrors({});
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setFormData({
      productId: "",
      quantity: 1,
      unitPrice: 0,
    });
    setSelectedProduct(null);
    setErrors({});
    onOpenChange(false);
  };

  const totalPrice = formData.quantity * formData.unitPrice;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            Thêm Sản Phẩm Vào Đơn Hàng
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn sản phẩm để thêm vào đơn hàng #{orderId.slice(-8)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm sản phẩm theo tên hoặc thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Bộ lọc
                {(selectedBrand || selectedSubCategory) && (
                  <Badge variant="secondary" className="ml-1">
                    {(selectedBrand ? 1 : 0) + (selectedSubCategory ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              <div className="text-sm text-muted-foreground">
                Tìm thấy {filteredProducts.length} sản phẩm
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Thương hiệu</Label>
                    <Select
                      value={selectedBrand}
                      onValueChange={setSelectedBrand}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả thương hiệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tất cả thương hiệu</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.brandName}>
                            {brand.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Danh mục phụ</Label>
                    <Select
                      value={selectedSubCategory}
                      onValueChange={setSelectedSubCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tất cả danh mục</SelectItem>
                        {subCategories.map((subCategory) => (
                          <SelectItem
                            key={subCategory.id}
                            value={subCategory.subCategoryName}
                          >
                            {subCategory.subCategoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(selectedBrand || selectedSubCategory) && (
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBrand("");
                        setSelectedSubCategory("");
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Product Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Package2 className="h-5 w-5" />
              Chọn sản phẩm
            </Label>

            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Đang tải sản phẩm...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-sm text-gray-500">
                  Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {filteredProducts.map((product: ProductResponse) => (
                  <Card
                    key={product.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData.productId === product.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, productId: product.id })
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {product.productName}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {product.brandName}
                            </span>
                            <span>Tồn kho: {product.stockQuantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {product.price.toLocaleString("vi-VN")} ₫
                          </div>
                          {product.stockQuantity === 0 && (
                            <Badge variant="destructive" className="mt-1">
                              Hết hàng
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Selected Product Details & Quantity */}
          {selectedProduct && (
            <form onSubmit={handleSubmit}>
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Selected Product Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {selectedProduct.productName}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-gray-600">
                              <span className="font-medium">Thương hiệu:</span>{" "}
                              {selectedProduct.brandName}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Danh mục:</span>{" "}
                              {selectedProduct.subCategoryName}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-600">
                              <span className="font-medium">Đơn giá:</span>{" "}
                              <span className="font-bold text-blue-600">
                                {selectedProduct.price.toLocaleString("vi-VN")}{" "}
                                ₫
                              </span>
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Tồn kho:</span>{" "}
                              <span
                                className={
                                  selectedProduct.stockQuantity > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {selectedProduct.stockQuantity}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Quantity and Price Inputs */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quantity Input */}
                        <div className="space-y-3">
                          <Label
                            htmlFor="quantity"
                            className="text-base font-medium"
                          >
                            Số lượng *
                          </Label>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  quantity: Math.max(1, prev.quantity - 1),
                                }))
                              }
                              disabled={loading || formData.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id="quantity"
                              type="number"
                              value={formData.quantity}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  quantity: Math.max(1, Number(e.target.value)),
                                })
                              }
                              min="1"
                              max={selectedProduct.stockQuantity}
                              disabled={loading}
                              className="text-center font-medium"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  quantity: Math.min(
                                    selectedProduct.stockQuantity,
                                    prev.quantity + 1
                                  ),
                                }))
                              }
                              disabled={
                                loading ||
                                formData.quantity >=
                                  selectedProduct.stockQuantity
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          {errors.quantity && (
                            <p className="text-sm text-destructive">
                              {errors.quantity}
                            </p>
                          )}
                        </div>

                        {/* Unit Price Input */}
                        <div className="space-y-3">
                          <Label
                            htmlFor="unitPrice"
                            className="text-base font-medium"
                          >
                            Đơn giá *
                          </Label>
                          <Input
                            id="unitPrice"
                            type="number"
                            value={formData.unitPrice}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                unitPrice: Number(e.target.value),
                              })
                            }
                            min="0"
                            step="1000"
                            disabled={loading}
                            className="font-medium"
                          />
                          {errors.unitPrice && (
                            <p className="text-sm text-destructive">
                              {errors.unitPrice}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Total Price Display */}
                      {formData.quantity > 0 && formData.unitPrice > 0 && (
                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-green-600" />
                                <span className="text-lg font-semibold text-gray-900">
                                  Tổng tiền:
                                </span>
                              </div>
                              <span className="text-2xl font-bold text-green-600">
                                {totalPrice.toLocaleString("vi-VN")} ₫
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}

          {/* Error when no product selected */}
          {errors.productId && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-sm text-red-600 text-center">
                  {errors.productId}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 flex justify-end space-x-3 pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedProduct || formData.quantity <= 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <ShoppingCart className="mr-2 h-4 w-4" />
            Thêm Vào Đơn Hàng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
