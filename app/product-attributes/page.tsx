"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { ProductAttributeDialog } from "@/components/product-attributes/product-attribute-dialog";
import { ProductAttributeTable } from "@/components/product-attributes/product-attribute-table";
import { ProductSelector } from "@/components/product-attributes/product-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useProductAttributes,
  ProductAttributeWithDetails,
} from "@/hooks/use-product-attributes";

export default function ProductAttributesPage() {
  const {
    productAttributes,
    attributes,
    availableAttributes,
    selectedProduct,
    selectedProductId,
    loading,
    creating,
    updating,
    deleting,
    createProductAttribute,
    updateProductAttribute,
    deleteProductAttribute,
    selectProduct,
  } = useProductAttributes();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProductAttribute, setEditingProductAttribute] =
    useState<ProductAttributeWithDetails | null>(null);

  const handleCreate = () => {
    if (!selectedProductId || availableAttributes.length === 0) {
      return;
    }
    setEditingProductAttribute(null);
    setDialogOpen(true);
  };

  const handleEdit = (productAttribute: ProductAttributeWithDetails) => {
    setEditingProductAttribute(productAttribute);
    setDialogOpen(true);
  };

  const handleSubmit = async (
    attributeId: string,
    productId: string,
    value: string
  ) => {
    return await createProductAttribute(attributeId, productId, value);
  };

  const handleUpdate = async (
    productAttributeId: string,
    attributeId?: string,
    value?: string
  ) => {
    return await updateProductAttribute(productAttributeId, attributeId, value);
  };

  const handleDelete = async (productAttributeId: string) => {
    return await deleteProductAttribute(productAttributeId);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Thuộc tính sản phẩm
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý các giá trị thuộc tính cho từng sản phẩm cụ thể
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="flex items-center gap-2"
            disabled={
              !selectedProductId ||
              creating ||
              updating ||
              availableAttributes.length === 0
            }
            title={
              !selectedProductId
                ? "Vui lòng chọn sản phẩm trước"
                : availableAttributes.length === 0
                ? "Tất cả thuộc tính đã được thêm"
                : "Thêm thuộc tính mới"
            }
          >
            <Plus size={20} />
            {availableAttributes.length === 0 && selectedProductId
              ? "Đã thêm hết thuộc tính"
              : "Thêm thuộc tính"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chọn sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductSelector
                  selectedProductId={selectedProductId}
                  onProductSelect={selectProduct}
                  disabled={creating || updating}
                />
              </CardContent>
            </Card>
          </div>

          {/* Product Attributes Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedProductId
                    ? "Thuộc tính sản phẩm"
                    : "Chưa chọn sản phẩm"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ProductAttributeTable
                  productAttributes={productAttributes}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={loading}
                  deleting={deleting}
                  selectedProductId={selectedProductId}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog */}
        <ProductAttributeDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          productAttribute={editingProductAttribute}
          attributes={
            editingProductAttribute ? attributes : availableAttributes
          }
          selectedProduct={selectedProduct}
          selectedProductId={selectedProductId}
          onSubmit={handleSubmit}
          onUpdate={handleUpdate}
          loading={creating || updating}
        />
      </div>
    </AdminLayout>
  );
}
