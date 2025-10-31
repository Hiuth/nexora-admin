"use client";

import { useState, useEffect, useCallback } from "react";
import { productAttributeService } from "@/lib/api/product-attributes";
import { attributesService } from "@/lib/api/attributes";
import { productService } from "@/lib/api/product";
import {
  ProductAttributeResponse,
  AttributesResponse,
  ProductResponse,
} from "@/types";
import { toast } from "@/hooks/use-toast";

export interface ProductAttributeWithDetails extends ProductAttributeResponse {
  productName?: string;
}

export function useProductAttributes() {
  const [productAttributes, setProductAttributes] = useState<
    ProductAttributeWithDetails[]
  >([]);
  const [attributes, setAttributes] = useState<AttributesResponse[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Load attributes by category ID
  const loadAttributesByCategoryId = useCallback(async (categoryId: string) => {
    try {
      const response = await attributesService.getByCategoryId(categoryId);
      if (response.result) {
        setAttributes(response.result);
      } else {
        setAttributes([]);
      }
    } catch (error) {
      console.error("Error loading attributes by category:", error);
      setAttributes([]);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thuộc tính theo danh mục",
        variant: "destructive",
      });
    }
  }, []);

  // Load all attributes (fallback)
  const loadAttributes = useCallback(async () => {
    try {
      const response = await attributesService.getAll();
      if (response.result) {
        setAttributes(response.result);
      }
    } catch (error) {
      console.error("Error loading attributes:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thuộc tính",
        variant: "destructive",
      });
    }
  }, []);

  // Load product attributes by product ID
  const loadProductAttributes = useCallback(async (productId: string) => {
    if (!productId) {
      setProductAttributes([]);
      return;
    }

    setLoading(true);
    try {
      const response = await productAttributeService.getByProductId(productId);
      if (response.result) {
        setProductAttributes(response.result);
      }
    } catch (error) {
      console.error("Error loading product attributes:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thuộc tính sản phẩm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Create product attribute
  const createProductAttribute = useCallback(
    async (attributeId: string, productId: string, value: string) => {
      setCreating(true);
      try {
        const response = await productAttributeService.create(
          attributeId,
          productId,
          { value }
        );

        if (response.result) {
          toast({
            title: "Thành công",
            description: "Đã tạo thuộc tính sản phẩm mới",
          });

          // Reload product attributes
          await loadProductAttributes(productId);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating product attribute:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tạo thuộc tính sản phẩm",
          variant: "destructive",
        });
        return false;
      } finally {
        setCreating(false);
      }
    },
    [loadProductAttributes]
  );

  // Update product attribute
  const updateProductAttribute = useCallback(
    async (
      productAttributeId: string,
      attributeId?: string,
      value?: string
    ) => {
      setUpdating(true);
      try {
        const response = await productAttributeService.update(
          productAttributeId,
          attributeId,
          value ? { value } : undefined
        );

        if (response.result) {
          toast({
            title: "Thành công",
            description: "Đã cập nhật thuộc tính sản phẩm",
          });

          // Reload product attributes
          if (selectedProductId) {
            await loadProductAttributes(selectedProductId);
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating product attribute:", error);
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật thuộc tính sản phẩm",
          variant: "destructive",
        });
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [selectedProductId, loadProductAttributes]
  );

  // Delete product attribute
  const deleteProductAttribute = useCallback(
    async (productAttributeId: string) => {
      setDeleting(productAttributeId);
      try {
        await productAttributeService.delete(productAttributeId);
        toast({
          title: "Thành công",
          description: "Đã xóa thuộc tính sản phẩm",
        });

        // Reload product attributes
        if (selectedProductId) {
          await loadProductAttributes(selectedProductId);
        }
        return true;
      } catch (error) {
        console.error("Error deleting product attribute:", error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa thuộc tính sản phẩm",
          variant: "destructive",
        });
        return false;
      } finally {
        setDeleting(null);
      }
    },
    [selectedProductId, loadProductAttributes]
  );

  // Select product
  const selectProduct = useCallback(
    async (productId: string) => {
      setSelectedProductId(productId);
      setSelectedProduct(null);
      setAttributes([]);

      if (productId) {
        try {
          // Load product details
          const productResponse = await productService.getById(productId);
          if (productResponse.code === 1000 && productResponse.result) {
            const product = productResponse.result;
            setSelectedProduct(product);

            // Load attributes for this product's category
            if (product.categoryId) {
              await loadAttributesByCategoryId(product.categoryId);
            } else {
              // Fallback to all attributes if no categoryId
              await loadAttributes();
            }
          }
        } catch (error) {
          console.error("Error loading product details:", error);
          toast({
            title: "Lỗi",
            description: "Không thể tải thông tin sản phẩm",
            variant: "destructive",
          });
          // Fallback to all attributes
          await loadAttributes();
        }

        // Load product attributes
        await loadProductAttributes(productId);
      }
    },
    [loadProductAttributes, loadAttributesByCategoryId, loadAttributes]
  );

  // Initialize
  useEffect(() => {
    loadAttributes();
  }, [loadAttributes]);

  return {
    productAttributes,
    attributes,
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
    loadProductAttributes,
    loadAttributes,
  };
}
