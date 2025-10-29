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
  WarrantyRecordResponse,
  ProductResponse,
  OrderResponse,
  ProductUnitResponse,
  DialogMode,
  CreateWarrantyRequest,
  UpdateWarrantyRequest,
} from "@/types";
import {
  warrantyService,
  productService,
  orderService,
  productUnitService,
} from "@/lib/api";
import { formatDate } from "@/lib/api-utils";

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
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [productUnits, setProductUnits] = useState<ProductUnitResponse[]>([]);
  const [formData, setFormData] = useState({
    productId: "",
    orderId: "",
    productUnitId: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (open) {
      loadProducts();
      loadOrders();
      if (mode === "edit" && data) {
        setFormData({
          productId: data.productId,
          orderId: data.orderId,
          productUnitId: data.productUnitId,
          status: data.status,
        });
        loadProductUnits(data.productId);
      } else {
        setFormData({
          productId: "",
          orderId: "",
          productUnitId: "",
          status: "ACTIVE",
        });
      }
    }
  }, [open, mode, data]);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll(1, 1000);
      if (response.Code === 1000 && response.Result?.Items) {
        setProducts(response.Result.Items);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    }
  };

  const loadOrders = async () => {
    try {
      const response = await orderService.getAll();
      if (response.Code === 1000 && response.Result) {
        setOrders(response.Result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng");
    }
  };

  const loadProductUnits = async (productId: string) => {
    try {
      const response = await productUnitService.getByProductId(productId);
      if (response.Code === 1000 && response.Result) {
        setProductUnits(response.Result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách đơn vị sản phẩm");
    }
  };

  const handleProductChange = (productId: string) => {
    setFormData((prev) => ({ ...prev, productId, productUnitId: "" }));
    loadProductUnits(productId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const request: CreateWarrantyRequest = {
          productId: formData.productId,
          orderId: formData.orderId,
          productUnitId: formData.productUnitId,
          startDate: new Date(),
          warrantyPeriod: 12, // Default 12 months
        };
        await warrantyService.create(
          formData.productId,
          formData.orderId,
          formData.productUnitId,
          request
        );
        toast.success("Tạo bảo hành thành công");
      } else if (mode === "edit" && data) {
        const request: UpdateWarrantyRequest = {
          status: formData.status,
        };
        await warrantyService.update(data.id, request);
        toast.success("Cập nhật bảo hành thành công");
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Tạo bảo hành mới"}
            {mode === "edit" && "Chỉnh sửa bảo hành"}
            {mode === "view" && "Chi tiết bảo hành"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "create" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="productId">Sản phẩm</Label>
                <Select
                  value={formData.productId}
                  onValueChange={handleProductChange}
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

              <div className="space-y-2">
                <Label htmlFor="orderId">Đơn hàng</Label>
                <Select
                  value={formData.orderId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, orderId: value }))
                  }
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id} - {order.CustomerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productUnitId">Đơn vị sản phẩm</Label>
                <Select
                  value={formData.productUnitId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, productUnitId: value }))
                  }
                  disabled={isViewMode || !formData.productId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {productUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.serialNumber || unit.imei || unit.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {(mode === "edit" || mode === "view") && data && (
            <>
              <div className="space-y-2">
                <Label>Sản phẩm</Label>
                <Input value={data.productName} disabled />
              </div>

              <div className="space-y-2">
                <Label>Đơn hàng</Label>
                <Input value={data.orderId} disabled />
              </div>

              <div className="space-y-2">
                <Label>Số Serial / IMEI</Label>
                <Input
                  value={data.serialNumber || data.imei || "Chưa có"}
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày bắt đầu</Label>
                  <Input value={formatDate(data.startDate)} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Ngày kết thúc</Label>
                  <Input value={formatDate(data.endDate)} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Thời gian bảo hành (tháng)</Label>
                <Input value={data.warrantyPeriod} disabled />
              </div>
            </>
          )}

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
                <SelectItem value="ACTIVE">Còn hiệu lực</SelectItem>
                <SelectItem value="EXPIRED">Đã hết hạn</SelectItem>
                <SelectItem value="CLAIMED">Đã sử dụng</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
