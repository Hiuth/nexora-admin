"use client";

import { useState, useEffect, useCallback } from "react";
import { productAttributeService } from "@/lib/api/product-attributes";
import { attributesService } from "@/lib/api/attributes";
import {
  ProductAttributeResponse,
  AttributesResponse,
  ProductResponse,
} from "@/types";
import { toast } from "@/hooks/use-toast";

export interface ProductAttributeWithDetails extends ProductAttributeResponse {
  productName?: string;
}

export function useProductAttributesByProduct(selectedProduct: ProductResponse | null) {
  const [productAttributes, setProductAttributes] = useState<
    ProductAttributeWithDetails[]
  >([]);
  const [attributes, setAttributes] = useState<AttributesResponse[]>([]);
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
        const productAttributesData = response.result.map((pa) => ({
          ...pa,
          productName: selectedProduct?.productName,
        }));
        setProductAttributes(productAttributesData);
      } else {
        setProductAttributes([]);
      }
    } catch (error) {
      console.error("Error loading product attributes:", error);
      setProductAttributes([]);
      toast({
        title: "Lỗi",
        description: "Không thể tải thuộc tính sản phẩm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedProduct]);

  // Create product attribute
  const createProductAttribute = async (
    attributeId: string,
    productId: string,
    value: string
  ): Promise<boolean> => {
    setCreating(true);
    try {
      const response = await productAttributeService.create(
        attributeId,
        productId,
        { value }
      );

      if (response.result) {
        const newProductAttribute: ProductAttributeWithDetails = {
          ...response.result,
          productName: selectedProduct?.productName,
        };
        setProductAttributes((prev) => [...prev, newProductAttribute]);
        
        toast({
          title: "Thành công",
          description: "Tạo thuộc tính sản phẩm thành công",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo thuộc tính sản phẩm",
        variant: "destructive",
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  // Update product attribute
  const updateProductAttribute = async (
    productAttributeId: string,
    attributeId: string,
    value: string
  ): Promise<boolean> => {
    setUpdating(true);
    try {
      const response = await productAttributeService.update(
        productAttributeId,
        attributeId,
        value
      );

      if (response.result) {
        const updatedProductAttribute: ProductAttributeWithDetails = {
          ...response.result,
          productName: selectedProduct?.productName,
        };
        
        setProductAttributes((prev) =>
          prev.map((pa) =>
            pa.id === productAttributeId ? updatedProductAttribute : pa
          )
        );
        
        toast({
          title: "Thành công",
          description: "Cập nhật thuộc tính sản phẩm thành công",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật thuộc tính sản phẩm",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Delete product attribute
  const deleteProductAttribute = async (
    productAttributeId: string
  ): Promise<boolean> => {
    setDeleting(productAttributeId);
    try {
      await productAttributeService.delete(productAttributeId);
      
      setProductAttributes((prev) =>
        prev.filter((pa) => pa.id !== productAttributeId)
      );
      
      toast({
        title: "Thành công",
        description: "Xóa thuộc tính sản phẩm thành công",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa thuộc tính sản phẩm",
        variant: "destructive",
      });
      return false;
    } finally {
      setDeleting(null);
    }
  };

  // Calculate available attributes (those not yet assigned to this product)
  const availableAttributes = attributes.filter(
    (attr) => !productAttributes.some((pa) => pa.attributeId === attr.id)
  );

  // Load data when product changes
  useEffect(() => {
    if (selectedProduct) {
      loadAttributesByCategoryId(selectedProduct.categoryId);
      loadProductAttributes(selectedProduct.id);
    } else {
      setAttributes([]);
      setProductAttributes([]);
    }
  }, [selectedProduct, loadAttributesByCategoryId, loadProductAttributes]);

  return {
    productAttributes,
    attributes,
    availableAttributes,
    selectedProduct,
    loading,
    creating,
    updating,
    deleting,
    createProductAttribute,
    updateProductAttribute,
    deleteProductAttribute,
    refetch: () => {
      if (selectedProduct) {
        loadProductAttributes(selectedProduct.id);
      }
    },
  };
}