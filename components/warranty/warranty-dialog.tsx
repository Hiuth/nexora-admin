"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WarrantyRecordResponse, DialogMode } from "@/types";
import { warrantyRecordService } from "@/lib/api/warranty";
import { useToast } from "@/hooks/use-toast";

interface WarrantyDialogProps {
  open: boolean;
  mode: DialogMode;
  data?: WarrantyRecordResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export function WarrantyDialog({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: WarrantyDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: "VALID",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open && data) {
      setFormData({
        status: data.status,
      });
    } else {
      setFormData({
        status: "VALID",
      });
    }
  }, [open, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode !== "edit" || !data) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Dialog chỉ hỗ trợ chỉnh sửa trạng thái bảo hành",
      });
      return;
    }

    setLoading(true);

    try {
      await warrantyRecordService.update(data.id, formData.status);

      toast({
        title: "Thành công",
        description: "Cập nhật bảo hành thành công",
      });

      onSubmit();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật bảo hành",
      });
    } finally {
      setLoading(false);
    }
  };

  const isViewMode = mode === "view";
  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "VALID":
        return "Còn hiệu lực";
      case "EXPIRED":
        return "Hết hạn";
      case "CLAIMED":
        return "Đã sử dụng";
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" && "Chỉnh sửa bảo hành"}
            {mode === "view" && "Chi tiết bảo hành"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sản phẩm</Label>
                  <Input
                    value={data.productName}
                    disabled
                    className="bg-gray-50 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Mã đơn hàng</Label>
                  <Input
                    value={data.orderId}
                    disabled
                    className="bg-gray-50 text-sm"
                  />
                </div>
              </div>

              {(data.serialNumber || data.imei) && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Số Serial / IMEI
                  </Label>
                  <Input
                    value={data.serialNumber || data.imei || "Chưa có"}
                    disabled
                    className="bg-gray-50 text-sm"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Ngày bắt đầu</Label>
                  <Input
                    value={new Date(data.startDate).toLocaleDateString("vi-VN")}
                    disabled
                    className="bg-gray-50 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Ngày kết thúc</Label>
                  <Input
                    value={new Date(data.endDate).toLocaleDateString("vi-VN")}
                    disabled
                    className="bg-gray-50 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Thời gian bảo hành
                </Label>
                <Input
                  value={`${data.warrantyPeriod} tháng`}
                  disabled
                  className="bg-gray-50 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Trạng thái
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                  disabled={isViewMode}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VALID">Còn hiệu lực</SelectItem>
                    <SelectItem value="EXPIRED">Hết hạn</SelectItem>
                    <SelectItem value="CLAIMED">Đã sử dụng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              {isViewMode ? "Đóng" : "Hủy"}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={loading} className="px-6">
                {loading ? "Đang xử lý..." : "Cập nhật"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
