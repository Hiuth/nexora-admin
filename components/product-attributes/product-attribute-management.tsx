"use client";

import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductAttributeDialog } from "./product-attribute-dialog";
import { ProductAttributeTable } from "./product-attribute-table";
import { ProductResponse } from "@/types";
import {
  useProductAttributesByProduct,
  ProductAttributeWithDetails,
} from "@/hooks/use-product-attributes-by-product";

interface ProductAttributeManagementProps {
  selectedProduct: ProductResponse;
}

export function ProductAttributeManagement({
  selectedProduct,
}: ProductAttributeManagementProps) {
  const {
    productAttributes,
    attributes,
    availableAttributes,
    loading,
    creating,
    updating,
    deleting,
    createProductAttribute,
    updateProductAttribute,
    deleteProductAttribute,
  } = useProductAttributesByProduct(selectedProduct);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProductAttribute, setEditingProductAttribute] =
    useState<ProductAttributeWithDetails | null>(null);

  const handleCreate = () => {
    if (!selectedProduct?.id || availableAttributes.length === 0) {
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

  if (!selectedProduct) return null;

  return (
    <>
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
              !selectedProduct?.id ||
              creating ||
              updating ||
              availableAttributes.length === 0
            }
            title={
              !selectedProduct?.id
                ? "Vui lòng chọn sản phẩm"
                : availableAttributes.length === 0
                ? "Không có thuộc tính khả dụng cho danh mục này"
                : "Thêm thuộc tính mới"
            }
          >
            <Plus className="h-4 w-4" />
            Thêm thuộc tính
          </Button>
        </CardHeader>
        <CardContent>
          {/* Instructions */}
          {availableAttributes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Tag className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">
                Không có thuộc tính khả dụng
              </p>
              <p className="text-sm">
                Danh mục "{selectedProduct.categoryName}" chưa có thuộc tính nào được
                định nghĩa, hoặc tất cả thuộc tính đã được gán cho sản phẩm này.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  Thông tin sản phẩm
                </h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên sản phẩm:</span>
                    <span className="font-medium">{selectedProduct.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Danh mục:</span>
                    <span>{selectedProduct.categoryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thương hiệu:</span>
                    <span>{selectedProduct.brandName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thuộc tính khả dụng:</span>
                    <span className="font-medium text-blue-600">
                      {availableAttributes.length} thuộc tính
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Attributes Table */}
              <ProductAttributeTable
                productAttributes={productAttributes}
                loading={loading}
                deleting={deleting}
                selectedProductId={selectedProduct.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Create/Edit */}
      <ProductAttributeDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        attributes={attributes}
        productAttribute={editingProductAttribute}
        selectedProduct={selectedProduct}
        selectedProductId={selectedProduct.id}
        loading={creating || updating}
        onSubmit={handleSubmit}
        onUpdate={handleUpdate}
      />
    </>
  );
}