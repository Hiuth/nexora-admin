"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { ProductDialog } from "@/components/products/product-dialog";
import {
  ProductFilter,
  ProductFilterState,
} from "@/components/products/product-filter";
import { ProductExport } from "@/components/products/product-export";
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
  }, [pagination.currentPage, pagination.pageSize]);

  const loadProducts = async (customFilters?: ProductFilterState) => {
    try {
      setLoading(true);
      const currentFilters = customFilters || filters;
      let response;

      // Determine which API to call based on active filters
      if (currentFilters.search) {
        response = await productService.search(
          currentFilters.search,
          pagination.currentPage,
          pagination.pageSize
        );
      } else if (currentFilters.brandId) {
        response = await productService.getByBrandId(
          currentFilters.brandId,
          pagination.currentPage,
          pagination.pageSize
        );
      } else if (currentFilters.subCategoryId) {
        response = await productService.getBySubCategoryId(
          currentFilters.subCategoryId,
          pagination.currentPage,
          pagination.pageSize
        );
      } else if (
        currentFilters.priceRange.min ||
        currentFilters.priceRange.max
      ) {
        const minPrice = parseFloat(currentFilters.priceRange.min) || 0;
        const maxPrice = parseFloat(currentFilters.priceRange.max) || 999999999;
        response = await productService.getByPriceRange(
          minPrice,
          maxPrice,
          pagination.currentPage,
          pagination.pageSize
        );
      } else {
        response = await productService.getAll(
          pagination.currentPage,
          pagination.pageSize
        );
      }

      if (response.code === 1000 && response.result?.data) {
        let filteredProducts = response.result.data;

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

        setProducts(filteredProducts);

        // Update pagination if available
        if (response.result.pageNumber !== undefined) {
          setPagination((prev) => ({
            ...prev,
            currentPage: response.result.pageNumber,
            totalPages: response.result.totalPages || 0,
            totalItems: response.result.totalCount || 0,
          }));
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
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
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
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

  const handleDialogSubmit = () => {
    loadProducts();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
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

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">Đang tải...</div>
          </div>
        ) : (
          <>
            {/* Export */}
            <div className="flex items-center justify-end">
              <ProductExport products={products} filters={filters} />
            </div>

            {/* Products Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Tên sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Thương hiệu
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Danh mục con
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Tồn kho
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-foreground">
                          {product.productName}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {product.brandName}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {product.subCategoryName}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              product.stockQuantity > 10
                                ? "bg-green-500/20 text-green-400"
                                : product.stockQuantity > 0
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              product.status === "ACTIVE"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {product.status === "ACTIVE"
                              ? "Hoạt động"
                              : "Ngưng hoạt động"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 hover:bg-background rounded transition-colors"
                            >
                              <Edit2 size={18} className="text-foreground" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-muted-foreground"
                      >
                        {Object.values(filters).some(
                          (v) =>
                            v !== "" &&
                            (typeof v !== "object" ||
                              Object.values(v).some((vv) => vv !== ""))
                        )
                          ? "Không tìm thấy sản phẩm nào phù hợp với bộ lọc"
                          : "Không có sản phẩm nào"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Đầu
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>

                {/* Page Numbers */}
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                    if (pageNum <= pagination.totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm border border-border rounded-md hover:bg-muted ${
                            pageNum === pagination.currentPage
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  }
                )}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cuối
                </button>
              </div>
            )}
          </>
        )}

        <ProductDialog
          open={dialogOpen}
          mode={dialogMode}
          data={selectedProduct}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleDialogSubmit}
        />
      </div>
    </AdminLayout>
  );
}
