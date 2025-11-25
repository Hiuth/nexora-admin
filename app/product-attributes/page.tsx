"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { ProductSelectorInfinite } from "@/components/product-attributes/product-selector-infinite";
import { ProductAttributeManagement } from "@/components/product-attributes/product-attribute-management";
import { ProductResponse } from "@/types";

export default function ProductAttributesPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

  const handleProductSelect = (product: ProductResponse | null) => {
    setSelectedProduct(product);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
            <Tag className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Thuộc Tính Sản Phẩm</h1>
            <p className="text-muted-foreground">
              Quản lý các giá trị thuộc tính cho từng sản phẩm cụ thể với auto loading
            </p>
          </div>
        </div>

        {/* Product Selector */}
        <ProductSelectorInfinite
          onProductSelect={handleProductSelect}
          selectedProduct={selectedProduct}
          title="Chọn sản phẩm"
        />

        {/* Product Attributes Management */}
        {selectedProduct && (
          <ProductAttributeManagement selectedProduct={selectedProduct} />
        )}
      </div>
    </AdminLayout>
  );
}