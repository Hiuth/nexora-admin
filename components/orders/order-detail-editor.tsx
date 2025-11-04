"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderResponse, OrderDetailResponse, ProductResponse } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { brandService, subCategoryService } from "@/lib/api";
import { orderDetailService } from "@/lib/api/order-details";
import { toast } from "sonner";
import {
  ProductFilters,
  ProductList,
  OrderDetailCart,
  ProductConfiguration,
  DeleteConfirmationDialog,
} from "./order-detail-editor/";

interface OrderDetailEditorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderResponse;
  orderDetails: OrderDetailResponse[];
  onOrderUpdated: () => void;
}

interface FilterState {
  searchTerm: string;
  selectedBrand: string;
  selectedSubCategory: string;
}

export function OrderDetailEditor({
  isOpen,
  onOpenChange,
  order,
  orderDetails,
  onOrderUpdated,
}: OrderDetailEditorProps) {
  // Hooks
  const { products, loading: productsLoading, fetchProducts } = useProducts();

  // State
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderDetailToDelete, setOrderDetailToDelete] =
    useState<OrderDetailResponse | null>(null);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedBrand: "",
    selectedSubCategory: "",
  });

  // Data states
  const [brands, setBrands] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  // Ref để track xem đã load products chưa
  const productsLoadedRef = useRef(false);

  // Stable function để refresh products
  const refreshProducts = useCallback(() => {
    if (filters.selectedBrand || filters.selectedSubCategory) {
      fetchProducts(filters.selectedBrand, filters.selectedSubCategory);
    } else {
      fetchProducts();
    }
  }, [filters.selectedBrand, filters.selectedSubCategory, fetchProducts]);

  // Load brands, subcategories and initial products ONLY when dialog opens
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load filter data
        const [brandsResponse, subCategoriesResponse] = await Promise.all([
          brandService.getAll(),
          subCategoryService.getAll(),
        ]);

        if (brandsResponse.result) {
          setBrands(brandsResponse.result);
        }
        if (subCategoriesResponse.result) {
          setSubCategories(subCategoriesResponse.result);
        }

        // Load initial products
        await fetchProducts();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (isOpen && !productsLoadedRef.current) {
      loadData();
      productsLoadedRef.current = true;
    } else if (!isOpen) {
      productsLoadedRef.current = false;
    }
  }, [isOpen]); // Chỉ depend vào isOpen

  // Reset selected product when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct(null);
      setQuantity(1);
      setFilters({
        searchTerm: "",
        selectedBrand: "",
        selectedSubCategory: "",
      });
    }
  }, [isOpen]);

  // Reload products when brand or subcategory filter changes
  useEffect(() => {
    // Chỉ reload khi dialog đã mở và có filter, và đã load lần đầu
    if (
      isOpen &&
      productsLoadedRef.current &&
      (filters.selectedBrand || filters.selectedSubCategory)
    ) {
      const timeoutId = setTimeout(() => {
        fetchProducts(filters.selectedBrand, filters.selectedSubCategory);
      }, 300); // Debounce để tránh gọi API quá nhiều

      return () => clearTimeout(timeoutId);
    }
  }, [filters.selectedBrand, filters.selectedSubCategory, isOpen]); // Loại bỏ fetchProducts dependency

  // Filter products based on search criteria (chỉ filter theo search term, brand và subcategory đã được filter ở API level)
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Exclude products already in cart
      const isInCart = orderDetails.some(
        (detail) => detail.productId === product.id
      );
      return !isInCart;
    });

    // Apply search filter (local search)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchLower) ||
          product.brandName.toLowerCase().includes(searchLower) ||
          product.categoryName.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [products, orderDetails, filters.searchTerm]);

  // Reset selected product if it's now in the cart (after being added)
  useEffect(() => {
    if (selectedProduct) {
      const isProductNowInCart = orderDetails.some(
        (detail) => detail.productId === selectedProduct.id
      );
      if (isProductNowInCart) {
        setSelectedProduct(null);
        setQuantity(1);
      }
    }
  }, [orderDetails, selectedProduct]);

  const handleAddProduct = async () => {
    if (!selectedProduct) {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    }

    if (quantity <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }

    if (quantity > selectedProduct.stockQuantity) {
      toast.error(
        `Không đủ hàng trong kho. Tồn kho: ${selectedProduct.stockQuantity}`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await orderDetailService.create(
        order.id,
        selectedProduct.id,
        {
          quantity,
          unitPrice: selectedProduct.price,
        }
      );
      if (response.result) {
        toast.success("Thêm sản phẩm thành công");
        // Don't reset immediately, let useEffect handle it after orderDetails update
        onOrderUpdated();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrderDetail = async () => {
    if (!orderDetailToDelete) return;

    setLoading(true);
    try {
      const response = await orderDetailService.delete(orderDetailToDelete.id);
      if (response.result) {
        toast.success("Xóa sản phẩm thành công");
        setDeleteDialogOpen(false);
        setOrderDetailToDelete(null);
        onOrderUpdated();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (orderDetail: OrderDetailResponse) => {
    setOrderDetailToDelete(orderDetail);
    setDeleteDialogOpen(true);
  };

  const totalAmount = orderDetails.reduce(
    (sum, detail) => sum + detail.price,
    0
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Chỉnh sửa chi tiết đơn hàng #{order.id.slice(-8)}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[60vh]">
            {/* Left Side - Product Filters and List */}
            <div className="lg:col-span-2 space-y-4">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                brands={brands}
                subCategories={subCategories}
              />

              <ProductList
                products={filteredProducts}
                loading={productsLoading}
                selectedProduct={selectedProduct}
                onProductSelect={setSelectedProduct}
                onRefresh={refreshProducts}
              />
            </div>

            {/* Right Side - Cart and Configuration */}
            <div className="space-y-4">
              <OrderDetailCart
                orderDetails={orderDetails}
                totalAmount={totalAmount}
                onDeleteClick={handleDeleteClick}
              />

              {selectedProduct && (
                <ProductConfiguration
                  selectedProduct={selectedProduct}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onAddProduct={handleAddProduct}
                  loading={loading}
                />
              )}
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        orderDetail={orderDetailToDelete}
        onConfirm={handleDeleteOrderDetail}
      />
    </>
  );
}
