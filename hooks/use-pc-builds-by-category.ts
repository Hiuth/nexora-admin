"use client";

import { useState, useEffect } from "react";
import { PcBuildResponse, PaginatedResponse } from "@/types";
import { pcBuildService } from "@/lib/api";
import { toast } from "sonner";

export function usePcBuildsByCategory(categoryId?: string) {
  const [pcBuilds, setPcBuilds] = useState<PcBuildResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPcBuilds = async () => {
    if (!categoryId) {
      setPcBuilds([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await pcBuildService.getByCategoryId(categoryId, 1, 100);
      if (response.code === 1000 && response.result) {
        const paginatedData =
          response.result as PaginatedResponse<PcBuildResponse>;
        setPcBuilds(paginatedData.items || []);
      } else {
        throw new Error(response.message || "Failed to fetch PC builds");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch PC builds");
      toast.error("Không thể tải danh sách cấu hình máy tính");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPcBuilds();
  }, [categoryId]);

  return {
    pcBuilds,
    loading,
    error,
    refetch: fetchPcBuilds,
  };
}
