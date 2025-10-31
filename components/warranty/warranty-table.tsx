"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { WarrantyRecordResponse, DialogMode } from "@/types";
import { warrantyService } from "@/lib/api";
import { WarrantyDialog } from "./warranty-dialog";
import { getStatusColor, getStatusText, formatDate } from "@/lib/api-utils";

export function WarrantyTable() {
  const [warranties, setWarranties] = useState<WarrantyRecordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [selectedWarranty, setSelectedWarranty] = useState<
    WarrantyRecordResponse | undefined
  >();

  useEffect(() => {
    loadWarranties();
  }, [statusFilter]);

  const loadWarranties = async () => {
    try {
      setLoading(true);
      let response;
      if (statusFilter && statusFilter !== "all") {
        response = await warrantyService.getByStatus(statusFilter);
      } else {
        // Since there's no getAll method, we'll need to implement it differently
        // For now, let's show empty state
        setWarranties([]);
        setLoading(false);
        return;
      }

      if (response.code === 1000 && response.result) {
        setWarranties(
          Array.isArray(response.result) ? response.result : [response.result]
        );
      }
    } catch (error) {
      toast.error("Không thể tải danh sách bảo hành");
    } finally {
      setLoading(false);
    }
  };

  const searchBySerialOrImei = async () => {
    if (!searchTerm.trim()) {
      loadWarranties();
      return;
    }

    try {
      setLoading(true);
      let response;
      try {
        response = await warrantyService.getBySerialNumber(searchTerm);
      } catch {
        response = await warrantyService.getByImei(searchTerm);
      }

      if (response.code === 1000 && response.result) {
        setWarranties([response.result]);
      }
    } catch (error) {
      toast.error("Không tìm thấy bảo hành");
      setWarranties([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWarranties = warranties.filter(
    (warranty) =>
      warranty.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.imei?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedWarranty(undefined);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEdit = (warranty: WarrantyRecordResponse) => {
    setSelectedWarranty(warranty);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleView = (warranty: WarrantyRecordResponse) => {
    setSelectedWarranty(warranty);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleDelete = async (warranty: WarrantyRecordResponse) => {
    if (confirm("Bạn có chắc chắn muốn xóa bảo hành này?")) {
      try {
        await warrantyService.delete(warranty.id);
        toast.success("Xóa bảo hành thành công");
        loadWarranties();
      } catch (error) {
        toast.error("Không thể xóa bảo hành");
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedWarranty(undefined);
  };

  const handleDialogSubmit = () => {
    loadWarranties();
  };

  const isExpired = (endDate: Date) => {
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quản lý bảo hành</CardTitle>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo bảo hành
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo Serial/IMEI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchBySerialOrImei()}
                className="pl-8"
              />
            </div>
            <Button onClick={searchBySerialOrImei} variant="outline">
              Tìm kiếm
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="ACTIVE">Còn hiệu lực</SelectItem>
                <SelectItem value="EXPIRED">Đã hết hạn</SelectItem>
                <SelectItem value="CLAIMED">Đã sử dụng</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Serial/IMEI</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Ngày kết thúc</TableHead>
                  <TableHead>Thời gian BH</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarranties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      {searchTerm || statusFilter
                        ? "Không tìm thấy dữ liệu"
                        : "Sử dụng bộ lọc hoặc tìm kiếm để hiển thị dữ liệu"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWarranties.map((warranty) => (
                    <TableRow key={warranty.id}>
                      <TableCell className="font-medium">
                        {warranty.productName}
                      </TableCell>
                      <TableCell>
                        {warranty.serialNumber || warranty.imei || (
                          <span className="text-muted-foreground">Chưa có</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{warranty.orderId}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(warranty.startDate)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            isExpired(warranty.endDate) ? "text-red-600" : ""
                          }
                        >
                          {formatDate(warranty.endDate)}
                        </span>
                      </TableCell>
                      <TableCell>{warranty.warrantyPeriod} tháng</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(warranty.status)}>
                          {getStatusText(warranty.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(warranty)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(warranty)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(warranty)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <WarrantyDialog
        open={dialogOpen}
        mode={dialogMode}
        data={selectedWarranty}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}
