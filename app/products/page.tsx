"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { ProductDialog } from "@/components/products/product-dialog";
import {
  ProductFilter,
  ProductFilterState,
} from "@/components/products/product-filter";
import { ProductList } from "@/components/products/product-list";
import { ProductDetailDialog } from "@/components/products/product-detail-dialog";
import { toast } from "sonner";
import { ProductResponse, DialogMode } from "@/types";
import { useProductsInfinite } from "@/hooks/use-products-infinite";

export default function ProductsPage() {
  const {
    products,
    loading,
    loadingMore,
    hasMore,
    totalItems,
    fetchProducts,
    loadMoreProducts,
    reset,
  } = useProductsInfinite();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [selectedProduct, setSelectedProduct] = useState<
    ProductResponse | undefined
  >();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] =
    useState<ProductResponse | null>(null);

  const [filters, setFilters] = useState<ProductFilterState>({
    search: "",
    brandId: "",
    subCategoryId: "",
    status: "",
    priceRange: {
      min: "",
      max: "",
    },
    stockFilter: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (customFilters?: ProductFilterState) => {
    const currentFilters = customFilters || filters;
    
    // Convert ProductFilterState to ProductFilterOptions for the hook
    const filterOptions = {
      search: currentFilters.search || undefined,
      brandId: currentFilters.brandId || undefined,
      subCategoryId: currentFilters.subCategoryId || undefined,
      minPrice: currentFilters.priceRange.min ? 
        parseFloat(currentFilters.priceRange.min) : undefined,
      maxPrice: currentFilters.priceRange.max ? 
        parseFloat(currentFilters.priceRange.max) : undefined,
    };

    await fetchProducts(filterOptions);
  };

  const handleSearch = () => {
    loadProducts();
  };

  const handleFiltersChange = (newFilters: ProductFilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: ProductFilterState = {
      search: "",
      brandId: "",
      subCategoryId: "",
      status: "",
      priceRange: {
        min: "",
        max: "",
      },
      stockFilter: "",
    };
    setFilters(resetFilters);
    loadProducts(resetFilters);
  };

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedProduct(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (product: ProductResponse) => {
    setDialogMode("edit");
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleViewDetail = (product: ProductResponse) => {
    setSelectedProductForDetail(product);
    setDetailDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    loadProducts();
  };

  // Filter products client-side for status and stock filters
  const filteredProducts = products.filter((product) => {
    // Status filter
    if (filters.status && product.status !== filters.status) {
      return false;
    }

    // Stock filter
    if (filters.stockFilter) {
      switch (filters.stockFilter) {
        case "in-stock":
          return product.stockQuantity > 0;
        case "low-stock":
          return product.stockQuantity >= 1 && product.stockQuantity <= 10;
        case "out-of-stock":
          return product.stockQuantity === 0;
        case "high-stock":
          return product.stockQuantity > 50;
        default:
          return true;
      }
    }

    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý sản phẩm
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý tất cả sản phẩm trong hệ thống
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            Thêm sản phẩm
          </button>
        </div>

        {/* Search and Filter Component */}
        <ProductFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          onReset={handleResetFilters}
        />

        {/* Products List with Infinite Scroll */}
        <ProductList
          products={filteredProducts}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          totalItems={totalItems}
          onLoadMore={loadMoreProducts}
          onEdit={handleEdit}
          onViewDetail={handleViewDetail}
          enableInfiniteScroll={true}
        />

        <ProductDialog
          open={dialogOpen}
          mode={dialogMode}
          data={selectedProduct}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleDialogSubmit}
        />

        <ProductDetailDialog
          open={detailDialogOpen}
          product={selectedProductForDetail}
          onOpenChange={(open) => {
            setDetailDialogOpen(open);
            if (!open) {
              setSelectedProductForDetail(null);
            }
          }}
        />
      </div>
    </AdminLayout>
  );
}



