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
import { Eye, Edit, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductUnitResponse, DialogMode } from "@/types";
import { productUnitService } from "@/lib/api";
import { ProductUnitDialog } from "./product-unit-dialog";
import { getStatusColor, getStatusText, formatDate } from "@/lib/api-utils";

export function ProductUnitTable() {
  const [productUnits, setProductUnits] = useState<ProductUnitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [selectedProductUnit, setSelectedProductUnit] = useState<
    ProductUnitResponse | undefined
  >();

  useEffect(() => {
    // Note: ProductUnit service không có getAll, nên ta sẽ cần load từ product specific
    // Tạm thời để trống và sẽ implement khi có product selection
    setLoading(false);
  }, []);

  const filteredProductUnits = productUnits.filter(
    (unit) =>
      unit.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.imei?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedProductUnit(undefined);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEdit = (productUnit: ProductUnitResponse) => {
    setSelectedProductUnit(productUnit);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleView = (productUnit: ProductUnitResponse) => {
    setSelectedProductUnit(productUnit);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleDelete = async (productUnit: ProductUnitResponse) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn vị sản phẩm này?")) {
      try {
        await productUnitService.delete(productUnit.id);
        toast.success("Xóa đơn vị sản phẩm thành công");
        // Reload data here
      } catch (error) {
        toast.error("Không thể xóa đơn vị sản phẩm");
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedProductUnit(undefined);
  };

  const handleDialogSubmit = () => {
    // Reload data here
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
            <CardTitle>Quản lý đơn vị sản phẩm</CardTitle>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm đơn vị sản phẩm
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đơn vị sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>IMEI</TableHead>
                  <TableHead>Số Serial</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProductUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">
                        {unit.productName}
                      </TableCell>
                      <TableCell>
                        {unit.imei || (
                          <span className="text-muted-foreground">Chưa có</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {unit.serialNumber || (
                          <span className="text-muted-foreground">Chưa có</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(unit.status)}>
                          {getStatusText(unit.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(unit.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(unit)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(unit)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(unit)}
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

      <ProductUnitDialog
        open={dialogOpen}
        mode={dialogMode}
        data={selectedProductUnit}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}
