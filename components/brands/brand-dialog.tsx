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
import { toast } from "sonner";
import {
  BrandResponse,
  DialogMode,
  CreateBrandRequest,
  UpdateBrandRequest,
} from "@/types";
import { brandService } from "@/lib/api";

interface BrandDialogProps {
  open: boolean;
  mode: DialogMode;
  data?: BrandResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export function BrandDialog({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: BrandDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandName: "",
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && data) {
        setFormData({
          brandName: data.brandName,
        });
      } else {
        setFormData({
          brandName: "",
        });
      }
    }
  }, [open, mode, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const request: CreateBrandRequest = {
          brandName: formData.brandName,
        };
        await brandService.create(request);
        toast.success("Tạo thương hiệu thành công");
      } else if (mode === "edit" && data) {
        // Chỉ gửi những field thay đổi
        const request: Partial<UpdateBrandRequest> = {};

        if (formData.brandName !== data.brandName) {
          request.brandName = formData.brandName;
        }

        // Chỉ gửi request nếu có thay đổi
        if (Object.keys(request).length > 0) {
          await brandService.update(data.id, request as UpdateBrandRequest);
          toast.success("Cập nhật thương hiệu thành công");
        } else {
          toast.info("Không có thay đổi nào để cập nhật");
        }
      }
      onSubmit();
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Tạo thương hiệu mới"
              : "Chỉnh sửa thương hiệu"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Tên thương hiệu</Label>
            <Input
              id="brandName"
              value={formData.brandName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  brandName: e.target.value,
                }))
              }
              placeholder="Nhập tên thương hiệu"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Đang xử lý..."
                : mode === "create"
                ? "Tạo"
                : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
