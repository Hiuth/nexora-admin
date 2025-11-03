"use client";

import { useState, useEffect } from "react";
import { PcBuildItemResponse } from "@/types";
import { pcBuildItemService } from "@/lib/api";
import { toast } from "sonner";

export function usePcBuildItems(pcBuildId?: string) {
  const [pcBuildItems, setPcBuildItems] = useState<PcBuildItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPcBuildItems = async () => {
    if (!pcBuildId) {
      setPcBuildItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await pcBuildItemService.getByPcBuildId(pcBuildId);
      if (response.code === 1000) {
        setPcBuildItems(response.result || []);
      } else {
        throw new Error(response.message || "Failed to fetch PC build items");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch PC build items");
      toast.error("Không thể tải danh sách linh kiện");
    } finally {
      setLoading(false);
    }
  };

  const deletePcBuildItem = async (id: string) => {
    try {
      const response = await pcBuildItemService.delete(id);
      if (response.code === 1000) {
        setPcBuildItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Xóa linh kiện thành công");
      } else {
        throw new Error(response.message || "Failed to delete PC build item");
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa linh kiện");
      throw err;
    }
  };

  useEffect(() => {
    fetchPcBuildItems();
  }, [pcBuildId]);

  return {
    pcBuildItems,
    loading,
    error,
    refetch: fetchPcBuildItems,
    deletePcBuildItem,
  };
}
