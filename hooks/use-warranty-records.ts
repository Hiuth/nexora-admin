"use client";

import { useState, useEffect } from "react";
import { WarrantyRecordResponse } from "@/types";
import { warrantyRecordService } from "@/lib/api/warranty";
import { useToast } from "@/hooks/use-toast";

export function useWarrantyRecords(orderId?: string) {
  const [warranties, setWarranties] = useState<WarrantyRecordResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWarranties = async () => {
    if (!orderId) {
      setWarranties([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await warrantyRecordService.getByOrderId(orderId);
      setWarranties(response.result || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch warranties");
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách bảo hành",
      });
    } finally {
      setLoading(false);
    }
  };

  const createWarranty = async (
    productId: string,
    orderId: string,
    productUnitId: string
  ) => {
    try {
      const response = await warrantyRecordService.create(
        productId,
        orderId,
        productUnitId
      );
      if (response.result) {
        setWarranties((prev) => [...prev, response.result!]);
        toast({
          title: "Thành công",
          description: "Tạo bảo hành thành công",
        });
        return response.result;
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err.message || "Không thể tạo bảo hành",
      });
      throw err;
    }
  };

  const updateWarranty = async (warrantyId: string, status: string) => {
    try {
      const response = await warrantyRecordService.update(warrantyId, status);
      if (response.result) {
        setWarranties((prev) =>
          prev.map((w) => (w.id === warrantyId ? response.result! : w))
        );
        toast({
          title: "Thành công",
          description: "Cập nhật bảo hành thành công",
        });
        return response.result;
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err.message || "Không thể cập nhật bảo hành",
      });
      throw err;
    }
  };

  const deleteWarranty = async (warrantyId: string) => {
    try {
      await warrantyRecordService.delete(warrantyId);
      setWarranties((prev) => prev.filter((w) => w.id !== warrantyId));
      toast({
        title: "Thành công",
        description: "Xóa bảo hành thành công",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err.message || "Không thể xóa bảo hành",
      });
      throw err;
    }
  };

  const getWarrantyBySerialNumber = async (serialNumber: string) => {
    try {
      const response = await warrantyRecordService.getBySerialNumber(
        serialNumber
      );
      return response.result;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err.message || "Không tìm thấy bảo hành",
      });
      throw err;
    }
  };

  const getWarrantyByImei = async (imei: string) => {
    try {
      const response = await warrantyRecordService.getByImei(imei);
      return response.result;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err.message || "Không tìm thấy bảo hành",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, [orderId]);

  return {
    warranties,
    loading,
    error,
    refetch: fetchWarranties,
    createWarranty,
    updateWarranty,
    deleteWarranty,
    getWarrantyBySerialNumber,
    getWarrantyByImei,
  };
}
