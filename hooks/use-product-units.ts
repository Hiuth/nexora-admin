"use client";

import { useState, useEffect } from "react";
import { ProductUnitResponse } from "@/types";
import { productUnitService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useProductUnits(productId?: string) {
  const [productUnits, setProductUnits] = useState<ProductUnitResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProductUnits = async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await productUnitService.getByProductId(productId);
      setProductUnits(response.result || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch product units");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch product units",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProductUnit = async (id: string) => {
    try {
      await productUnitService.delete(id);
      setProductUnits((prev) => prev.filter((unit) => unit.id !== id));
      toast({
        title: "Success",
        description: "Product unit deleted successfully",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete product unit",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchProductUnits();
  }, [productId]);

  return {
    productUnits,
    loading,
    error,
    refetch: fetchProductUnits,
    deleteProductUnit,
  };
}
