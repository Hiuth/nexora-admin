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
import { toast } from "sonner";
import {
  ProductUnitResponse,
  ProductResponse,
  DialogMode,
  CreateProductUnitRequest,
  UpdateProductUnitRequest,
} from "@/types";
import { productUnitService, productService } from "@/lib/api";

interface ProductUnitDialogProps {
  open: boolean;
  mode: DialogMode;
  data?: ProductUnitResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export function ProductUnitDialog({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: ProductUnitDialogProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [formData, setFormData] = useState({
    productId: "",
    imei: "",
    serialNumber: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (open) {
      loadProducts();
      if (mode === "edit" && data) {
        setFormData({
          productId: data.productId,
          imei: data.imei || "",
          serialNumber: data.serialNumber || "",
          status: data.status,
        });
      } else {
        setFormData({
          productId: "",
          imei: "",
          serialNumber: "",
          status: "ACTIVE",
        });
      }
    }
  }, [open, mode, data]);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll(1, 1000);
      if (response.code === 1000 && response.result?.Items) {
        setProducts(response.result.Items);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const request: CreateProductUnitRequest = {
          productId: formData.productId,
          imei: formData.imei || undefined,
          serialNumber: formData.serialNumber || undefined,
          status: formData.status,
        };
        await productUnitService.create(formData.productId, request);
        toast.success("Tạo đơn vị sản phẩm thành công");
      } else if (mode === "edit" && data) {
        const request: UpdateProductUnitRequest = {
          imei: formData.imei || undefined,
          serialNumber: formData.serialNumber || undefined,
          status: formData.status,
        };
        await productUnitService.update(data.id, request);
        toast.success("Cập nhật đơn vị sản phẩm thành công");
      }
      onSubmit();
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const isViewMode = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Tạo đơn vị sản phẩm mới"}
            {mode === "edit" && "Chỉnh sửa đơn vị sản phẩm"}
            {mode === "view" && "Chi tiết đơn vị sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="productId">Sản phẩm</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, productId: value }))
                }
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(mode === "edit" || mode === "view") && data && (
            <div className="space-y-2">
              <Label>Sản phẩm</Label>
              <Input value={data.productName} disabled />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="imei">IMEI</Label>
            <Input
              id="imei"
              value={formData.imei}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, imei: e.target.value }))
              }
              placeholder="Nhập IMEI"
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Số serial</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  serialNumber: e.target.value,
                }))
              }
              placeholder="Nhập số serial"
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
              disabled={isViewMode}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                <SelectItem value="SOLD">Đã bán</SelectItem>
                <SelectItem value="DEFECTIVE">Lỗi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "view" && data && (
            <div className="space-y-2">
              <Label>Ngày tạo</Label>
              <Input
                value={new Date(data.createdAt).toLocaleString("vi-VN")}
                disabled
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? "Đóng" : "Hủy"}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Đang xử lý..."
                  : mode === "create"
                  ? "Tạo"
                  : "Cập nhật"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
