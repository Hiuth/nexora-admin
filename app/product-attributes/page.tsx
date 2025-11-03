"use client";

import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { ProductAttributeDialog } from "@/components/product-attributes/product-attribute-dialog";
import { ProductAttributeTable } from "@/components/product-attributes/product-attribute-table";
import { ProductSelector } from "@/components/product-attributes/product-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    attributeId: string,
    value: string
  ) => {
    return await updateProductAttribute(productAttributeId, attributeId, value);
  };

  const handleDelete = async (productAttributeId: string) => {
    return await deleteProductAttribute(productAttributeId);
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
              Quản lý các giá trị thuộc tính cho từng sản phẩm cụ thể
            </p>
          </div>
        </div>

        {/* Product Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn Sản Phẩm</CardTitle>
            <CardDescription>
              Chọn sản phẩm để xem và quản lý các thuộc tính
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductSelector
              selectedProductId={selectedProductId}
              onProductSelect={selectProduct}
              disabled={creating || updating}
            />
          </CardContent>
        </Card>

        {/* Product Attributes Management */}
        {selectedProductId && selectedProduct && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Thuộc Tính Sản Phẩm</CardTitle>
                <CardDescription>
                  Thuộc tính của sản phẩm "{selectedProduct.productName}" (
                  {selectedProduct.categoryName})
                </CardDescription>
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
            </CardHeader>
            <CardContent className="pt-0">
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
        )}

        {/* Instructions */}
        {!selectedProductId && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 space-y-4">
                <Tag className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">Chưa chọn sản phẩm</h3>
                  <p className="text-muted-foreground">
                    Vui lòng chọn sản phẩm để bắt đầu quản lý thuộc tính
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
