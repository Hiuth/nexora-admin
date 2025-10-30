"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { ProductDialog } from "@/components/products/product-dialog";
import {
  ProductFilter,
  ProductFilterState,
} from "@/components/products/product-filter";
import { ProductTable } from "@/components/products/product-table";
import { ProductExport } from "@/components/products/product-export";
import { ProductDetailDialog } from "@/components/products/product-detail-dialog";
import { toast } from "sonner";
import { ProductResponse, DialogMode } from "@/types";
import { productService } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [selectedProduct, setSelectedProduct] = useState<
    ProductResponse | undefined
  >();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] =
    useState<ProductResponse | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
  });

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
  }, []); // Chỉ load một lần khi component mount

  const loadProducts = async (customFilters?: ProductFilterState) => {
    try {
      setLoading(true);
      const currentFilters = customFilters || filters;
      let response;

      console.log("Loading products with filters:", currentFilters);

      // Determine which API to call based on active filters
      if (currentFilters.search) {
        response = await productService.search(currentFilters.search);
      } else if (currentFilters.brandId) {
        response = await productService.getByBrandId(currentFilters.brandId);
      } else if (currentFilters.subCategoryId) {
        response = await productService.getBySubCategoryId(
          currentFilters.subCategoryId
        );
      } else if (
        currentFilters.priceRange.min ||
        currentFilters.priceRange.max
      ) {
        const minPrice = parseFloat(currentFilters.priceRange.min) || 0;
        const maxPrice = parseFloat(currentFilters.priceRange.max) || 999999999;
        response = await productService.getByPriceRange(minPrice, maxPrice);
      } else {
        response = await productService.getAll();
      }

      console.log("API Response:", response);

      if (response.code === 1000 && response.result) {
        // Backend returns PaginatedResponse với structure: { items, currentPage, totalPages, totalCount, pageSize }
        const paginatedData = response.result;
        let filteredProducts = paginatedData.items || [];

        console.log("Products from API:", filteredProducts);
        console.log("Pagination info:", {
          currentPage: paginatedData.currentPage,
          totalPages: paginatedData.totalPages,
          totalCount: paginatedData.totalCount,
          pageSize: paginatedData.pageSize,
        });

        // Apply client-side filters for status and stock
        if (currentFilters.status) {
          filteredProducts = filteredProducts.filter(
            (product: ProductResponse) =>
              product.status === currentFilters.status
          );
        }

        if (currentFilters.stockFilter) {
          filteredProducts = filteredProducts.filter(
            (product: ProductResponse) => {
              switch (currentFilters.stockFilter) {
                case "in-stock":
                  return product.stockQuantity > 0;
                case "low-stock":
                  return (
                    product.stockQuantity >= 1 && product.stockQuantity <= 10
                  );
                case "out-of-stock":
                  return product.stockQuantity === 0;
                case "high-stock":
                  return product.stockQuantity > 50;
                default:
                  return true;
              }
            }
          );
        }

        console.log("Filtered products:", filteredProducts);
        setProducts(filteredProducts);

        // Cập nhật pagination info từ backend
        if (paginatedData.currentPage !== undefined) {
          setPagination((prev) => ({
            ...prev,
            currentPage: paginatedData.currentPage || 1,
            totalPages: paginatedData.totalPages || 0,
            totalItems: paginatedData.totalCount || 0,
            pageSize: paginatedData.pageSize || 10,
          }));
        }
      } else {
        console.log("No products found or API error:", response);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
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

        {/* Export */}
        <div className="flex items-center justify-end">
          <ProductExport products={products} filters={filters} />
        </div>

        {/* Products Table */}
        <ProductTable
          products={products}
          loading={loading}
          filters={filters}
          onEdit={handleEdit}
          onViewDetail={handleViewDetail}
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
