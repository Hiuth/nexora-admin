"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Package,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { CreateWarrantyDialog } from "./create-warranty-dialog";
import {
  OrderResponse,
  WarrantyRecordResponse,
  OrderDetailResponse,
} from "@/types";
import { warrantyRecordService } from "@/lib/api/warranty";
import { useOrderDetails } from "@/hooks/use-order-details";
import { useToast } from "@/hooks/use-toast";

interface WarrantyTableProps {
  selectedOrder: OrderResponse | null;
  onRefresh?: () => void;
}

export function WarrantyTable({
  selectedOrder,
  onRefresh,
}: WarrantyTableProps) {
  const [warranties, setWarranties] = useState<WarrantyRecordResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] =
    useState<WarrantyRecordResponse | null>(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [creating, setCreating] = useState(false);

  const { orderDetails, loadOrderDetails } = useOrderDetails();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedOrder) {
      loadWarranties();
      loadOrderDetails(selectedOrder.id);
    }
  }, [selectedOrder]);

  const loadWarranties = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    try {
      const response = await warrantyRecordService.getByOrderId(
        selectedOrder.id
      );
      if (response.result) {
        setWarranties(response.result);
      }
    } catch (error) {
      console.error("Error loading warranties:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách bảo hành",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWarranty = async (
    productId: string,
    productUnitId: string
  ) => {
    if (!selectedOrder) return;

    setCreating(true);
    try {
      await warrantyRecordService.create(
        productId,
        selectedOrder.id,
        productUnitId
      );

      toast({
        title: "Thành công",
        description: "Tạo bảo hành thành công",
      });

      loadWarranties();
      onRefresh?.();
    } catch (error) {
      console.error("Error creating warranty:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo bảo hành",
      });
      throw error; // Re-throw to handle in dialog
    } finally {
      setCreating(false);
    }
  };

  const handleCreateWarrantyForNonSerial = async (productId: string) => {
    if (!selectedOrder) return;

    setCreating(true);
    try {
      // For non-serial products, pass empty string for productUnitId
      await warrantyRecordService.create(
        productId,
        selectedOrder.id,
        ""
      );

      toast({
        title: "Thành công",
        description: "Tạo bảo hành thành công cho sản phẩm không có serial",
      });

      loadWarranties();
      onRefresh?.();
    } catch (error) {
      console.error("Error creating warranty for non-serial product:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo bảo hành cho sản phẩm không có serial",
      });
      throw error; // Re-throw to handle in dialog
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateWarranty = async () => {
    if (!selectedWarranty || !updateStatus) return;

    try {
      await warrantyRecordService.update(selectedWarranty.id, updateStatus);

      toast({
        title: "Thành công",
        description: "Cập nhật trạng thái bảo hành thành công",
      });

      setUpdateDialogOpen(false);
      setSelectedWarranty(null);
      setUpdateStatus("");
      loadWarranties();
      onRefresh?.();
    } catch (error) {
      console.error("Error updating warranty:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật bảo hành",
      });
    }
  };

  const handleDeleteWarranty = async (warranty: WarrantyRecordResponse) => {
    setSelectedWarranty(warranty);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteWarranty = async () => {
    if (!selectedWarranty) return;

    try {
      await warrantyRecordService.delete(selectedWarranty.id);

      toast({
        title: "Thành công",
        description: "Xóa bảo hành thành công",
      });

      loadWarranties();
      onRefresh?.();
      setDeleteDialogOpen(false);
      setSelectedWarranty(null);
    } catch (error) {
      console.error("Error deleting warranty:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa bảo hành",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "VALID":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "EXPIRED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "CLAIMED":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "VALID":
        return "bg-green-500";
      case "EXPIRED":
        return "bg-red-500";
      case "CLAIMED":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!selectedOrder) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 space-y-4">
            <Shield className="h-16 w-16 text-muted-foreground/50 mx-auto" />
            <div>
              <h3 className="text-lg font-medium">Chưa chọn đơn hàng</h3>
              <p className="text-muted-foreground">
                Vui lòng chọn đơn hàng đang xử lý để tạo và quản lý bảo hành
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Danh sách bảo hành - Đơn hàng #{selectedOrder.id.slice(-8)}
              </CardTitle>
              <CardDescription>
                Quản lý bảo hành cho các sản phẩm trong đơn hàng
              </CardDescription>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo bảo hành
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Đang tải...</div>
            </div>
          ) : warranties.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto" />
              <div>
                <h4 className="font-medium">Chưa có bảo hành nào</h4>
                <p className="text-muted-foreground text-sm">
                  Nhấn "Tạo bảo hành" để bắt đầu tạo bảo hành cho sản phẩm
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Ngày kết thúc</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Serial/IMEI</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warranties.map((warranty) => (
                  <TableRow key={warranty.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {warranty.productName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {warranty.productId.slice(-8)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(warranty.startDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(warranty.endDate).toLocaleDateString("vi-VN")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {warranty.warrantyPeriod} tháng
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(warranty.status)}
                        <Badge
                          className={`text-white ${getStatusColor(
                            warranty.status
                          )}`}
                        >
                          {getStatusText(warranty.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {warranty.serialNumber && (
                          <div>SN: {warranty.serialNumber}</div>
                        )}
                        {warranty.imei && <div>IMEI: {warranty.imei}</div>}
                        {!warranty.serialNumber && !warranty.imei && (
                          <span className="text-muted-foreground">Chưa có</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedWarranty(warranty);
                            setUpdateStatus(warranty.status);
                            setUpdateDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteWarranty(warranty)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Warranty Dialog */}
      <CreateWarrantyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        orderDetails={orderDetails}
        existingWarranties={warranties}
        onCreateWarranty={handleCreateWarranty}
        onCreateWarrantyForNonSerial={handleCreateWarrantyForNonSerial}
        creating={creating}
      />

      {/* Update Warranty Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái bảo hành</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={updateStatus} onValueChange={setUpdateStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VALID">Còn hiệu lực</SelectItem>
                  <SelectItem value="EXPIRED">Hết hạn</SelectItem>
                  <SelectItem value="CLAIMED">Đã sử dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateWarranty} disabled={!updateStatus}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bảo hành</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa bảo hành này không? Hành động này không thể hoàn tác.
            </p>
            {selectedWarranty && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Thông tin bảo hành:</p>
                <p className="text-sm text-muted-foreground">
                  Mã: {selectedWarranty.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  Sản phẩm: {selectedWarranty.productName}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedWarranty(null);
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteWarranty}
            >
              Xóa bảo hành
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
