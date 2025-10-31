"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin-layout";
import { ProductUnitTable } from "@/components/product-units";
import { ProductSelector } from "@/components/product-units/product-selector";
import { useProductUnits } from "@/hooks/use-product-units";
import { ProductResponse } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductUnitsPage() {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  const { productUnits, loading, refetch, deleteProductUnit } = useProductUnits(
    selectedProduct?.id
  );

  const handleProductSelect = (product: ProductResponse) => {
    setSelectedProduct(product);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Quản Lý Đơn Vị Sản Phẩm</h1>
          <p className="text-muted-foreground">
            Chọn sản phẩm và quản lý từng đơn vị cụ thể
          </p>
        </div>

        {/* Product Selection */}
        <ProductSelector
          onProductSelect={handleProductSelect}
          selectedProduct={selectedProduct}
        />

        {/* Product Units Table */}
        {selectedProduct && (
          <Card>
            <CardContent className="p-6">
              <ProductUnitTable
                productUnits={productUnits}
                productId={selectedProduct.id}
                productName={selectedProduct.productName}
                stockQuantity={selectedProduct.stockQuantity}
                onRefresh={refetch}
                onDelete={deleteProductUnit}
              />
            </CardContent>
          </Card>
        )}

        {/* No Product Selected Message */}
        {!selectedProduct && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <p>
                  Vui lòng chọn sản phẩm từ dropdown ở trên để quản lý các đơn
                  vị của nó.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
