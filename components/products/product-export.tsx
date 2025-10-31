"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductResponse } from "@/types";
import { toast } from "sonner";

interface ProductExportProps {
  products: ProductResponse[];
  filters: any;
}

export function ProductExport({ products, filters }: ProductExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async () => {
    try {
      setIsExporting(true);

      // Create CSV content
      const headers = [
        "Tên sản phẩm",
        "Thương hiệu",
        "Danh mục",
        "Danh mục con",
        "Giá",
        "Tồn kho",
        "Trạng thái",
        "Mô tả",
        "Bảo hành (tháng)",
      ];

      const csvContent = [
        headers.join(","),
        ...products.map((product) =>
          [
            `"${product.productName}"`,
            `"${product.brandName}"`,
            `"${product.categoryName}"`,
            `"${product.subCategoryName}"`,
            product.price,
            product.stockQuantity,
            product.status === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động",
            `"${product.description || ""}"`,
            product.warrantyPeriod,
          ].join(",")
        ),
      ].join("\\n");

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `san-pham-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();

      toast.success("Xuất file CSV thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xuất file");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = async () => {
    try {
      setIsExporting(true);

      const exportData = {
        exportDate: new Date().toISOString(),
        filters,
        totalProducts: products.length,
        products: products.map((product) => ({
          id: product.id,
          productName: product.productName,
          brandName: product.brandName,
          categoryName: product.categoryName,
          subCategoryName: product.subCategoryName,
          price: product.price,
          stockQuantity: product.stockQuantity,
          status: product.status,
          description: product.description,
          warrantyPeriod: product.warrantyPeriod,
          thumbnailUrl: product.thumbnail,
        })),
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], {
        type: "application/json;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `san-pham-${new Date().toISOString().split("T")[0]}.json`;
      link.click();

      toast.success("Xuất file JSON thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xuất file");
    } finally {
      setIsExporting(false);
    }
  };

  const printReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Báo cáo sản phẩm</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { margin-bottom: 20px; padding: 15px; background: #f5f5f5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Báo cáo sản phẩm</h1>
            <p>Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}</p>
          </div>
          
          <div class="summary">
            <h3>Tóm tắt</h3>
            <p><strong>Tổng số sản phẩm:</strong> ${products.length}</p>
            <p><strong>Sản phẩm hoạt động:</strong> ${
              products.filter((p) => p.status === "ACTIVE").length
            }</p>
            <p><strong>Sản phẩm ngưng hoạt động:</strong> ${
              products.filter((p) => p.status !== "ACTIVE").length
            }</p>
            <p><strong>Tổng giá trị tồn kho:</strong> ${new Intl.NumberFormat(
              "vi-VN",
              { style: "currency", currency: "VND" }
            ).format(
              products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0)
            )}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Thương hiệu</th>
                <th>Danh mục</th>
                <th>Danh mục con</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (product) => `
                <tr>
                  <td>${product.productName}</td>
                  <td>${product.brandName}</td>
                  <td>${product.categoryName}</td>
                  <td>${product.subCategoryName}</td>
                  <td>${new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}</td>
                  <td>${product.stockQuantity}</td>
                  <td>${
                    product.status === "ACTIVE"
                      ? "Hoạt động"
                      : "Ngừng hoạt động"
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Báo cáo được tạo tự động từ hệ thống quản lý Nexora Admin</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Xuất dữ liệu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Xuất CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileText className="w-4 h-4 mr-2" />
          Xuất JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={printReport}>
          <FileText className="w-4 h-4 mr-2" />
          In báo cáo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
