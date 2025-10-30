"use client";

import { Edit2, Eye } from "lucide-react";
import { ProductResponse } from "@/types";

interface ProductTableProps {
  products: ProductResponse[];
  loading: boolean;
  filters: any;
  onEdit: (product: ProductResponse) => void;
  onViewDetail: (product: ProductResponse) => void;
}

export function ProductTable({
  products,
  loading,
  filters,
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
                        : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetail(product)}
                        className="p-2 hover:bg-background rounded transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 hover:bg-background rounded transition-colors"
                        title="Chỉnh sửa"
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
                        (v && Object.values(v).some((vv) => vv !== "")))
                  )
                    ? "Không tìm thấy sản phẩm nào phù hợp với bộ lọc"
                    : "Không có sản phẩm nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
