"use client";

import { Edit2, Eye } from "lucide-react";
import { ProductResponse } from "@/types";

interface ProductTableProps {
  products: ProductResponse[];
  loading: boolean;
  onEdit: (product: ProductResponse) => void;
  onViewDetail: (product: ProductResponse) => void;
}

export function ProductTable({
  products,
  loading,
  onEdit,
  onViewDetail,
}: ProductTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View (lg and above) */}
      <div className="hidden lg:block bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[200px]">
                  Tên sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[120px]">
                  Thương hiệu
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[120px]">
                  Danh mục
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[120px]">
                  Danh mục con
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[120px]">
                  Giá
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[100px]">
                  Tồn kho
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[100px]">
                  Serial/IMEI
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[120px]">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground min-w-[120px]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr
                    key={`${product.id}_desktop_${index}`}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-foreground font-medium">
                      <div
                        className="max-w-[180px] truncate"
                        title={product.productName}
                      >
                        {product.productName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div
                        className="max-w-[100px] truncate"
                        title={product.brandName}
                      >
                        {product.brandName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div
                        className="max-w-[100px] truncate"
                        title={product.categoryName}
                      >
                        {product.categoryName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div
                        className="max-w-[100px] truncate"
                        title={product.subCategoryName}
                      >
                        {product.subCategoryName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.isSerial
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {product.isSerial ? "Có" : "Không"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === "ACTIVE"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {product.status === "ACTIVE"
                          ? "Hoạt động"
                          : "Ngừng hoạt động"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewDetail(product)}
                          className="p-1.5 hover:bg-background rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 hover:bg-background rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={16} className="text-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablet View (md to lg) */}
      <div className="hidden md:block lg:hidden bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">
                  Sản phẩm
                </th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">
                  Giá / Tồn kho
                </th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">
                  Trạng thái
                </th>
                <th className="px-3 py-2 text-center text-sm font-semibold text-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr
                    key={`${product.id}_tablet_${index}`}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <div className="font-medium text-foreground text-sm">
                          {product.productName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.brandName} • {product.categoryName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.subCategoryName}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <div className="font-medium text-foreground text-sm">
                          {formatPrice(product.price)}
                        </div>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            product.stockQuantity > 10
                              ? "bg-green-500/20 text-green-400"
                              : product.stockQuantity > 0
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          Kho: {product.stockQuantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === "ACTIVE"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {product.status === "ACTIVE"
                            ? "Hoạt động"
                            : "Ngừng hoạt động"}
                        </span>
                        <div>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              product.isSerial
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {product.isSerial ? "Có Serial" : "Không Serial"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onViewDetail(product)}
                          className="p-2 hover:bg-blue-50 rounded transition-colors border"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 hover:bg-gray-50 rounded transition-colors border"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={16} className="text-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-8 text-center text-muted-foreground"
                  >
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (below md) */}
      <div className="block md:hidden space-y-4">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={`${product.id}_mobile_${index}`}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm leading-tight">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.brandName} • {product.categoryName}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => onViewDetail(product)}
                    className="p-2 hover:bg-blue-50 rounded transition-colors border border-blue-200"
                    title="Xem chi tiết"
                  >
                    <Eye size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 hover:bg-gray-50 rounded transition-colors border"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={16} className="text-foreground" />
                  </button>
                </div>
              </div>

              {/* Price and Stock */}
              <div className="flex justify-between items-center mb-3">
                <div className="font-semibold text-foreground">
                  {formatPrice(product.price)}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stockQuantity > 10
                      ? "bg-green-500/20 text-green-400"
                      : product.stockQuantity > 0
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  Kho: {product.stockQuantity}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Danh mục con:</span>
                  <div className="font-medium text-foreground mt-1 truncate">
                    {product.subCategoryName}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Serial/IMEI:</span>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        product.isSerial
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {product.isSerial ? "Có" : "Không"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-3 pt-3 border-t border-border">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === "ACTIVE"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {product.status === "ACTIVE"
                    ? "Hoạt động"
                    : "Ngừng hoạt động"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="text-muted-foreground">
              Không có sản phẩm nào
            </div>
          </div>
        )}
      </div>
    </>
  );
}
