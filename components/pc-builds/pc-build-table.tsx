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
import { Eye, Edit, Plus, Search, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";
import { PcBuildResponse, DialogMode } from "@/types";
import { pcBuildService } from "@/lib/api";
import { PcBuildDialog } from "./pc-build-dialog";
import { getStatusColor, getStatusText, formatCurrency } from "@/lib/api-utils";

export function PcBuildTable() {
  const [pcBuilds, setPcBuilds] = useState<PcBuildResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [selectedPcBuild, setSelectedPcBuild] = useState<
    PcBuildResponse | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadPcBuilds();
  }, [currentPage]);

  const loadPcBuilds = async () => {
    try {
      setLoading(true);
      const response = await pcBuildService.getAll(currentPage, pageSize);
      if (response.Code === 1000 && response.Result) {
        setPcBuilds(response.Result.Items || []);
        setTotalPages(response.Result.TotalPages || 1);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách PC Build");
    } finally {
      setLoading(false);
    }
  };

  const filteredPcBuilds = pcBuilds.filter(
    (pcBuild) =>
      pcBuild.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pcBuild.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedPcBuild(undefined);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEdit = (pcBuild: PcBuildResponse) => {
    setSelectedPcBuild(pcBuild);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleView = (pcBuild: PcBuildResponse) => {
    setSelectedPcBuild(pcBuild);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleDelete = async (pcBuild: PcBuildResponse) => {
    if (confirm("Bạn có chắc chắn muốn xóa PC Build này?")) {
      try {
        await pcBuildService.delete(pcBuild.id);
        toast.success("Xóa PC Build thành công");
        loadPcBuilds();
      } catch (error) {
        toast.error("Không thể xóa PC Build");
      }
    }
  };

  const handleManageItems = (pcBuild: PcBuildResponse) => {
    // Navigate to PC Build Items management
    window.location.href = `/admin/pc-builds/${pcBuild.id}/items`;
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedPcBuild(undefined);
  };

  const handleDialogSubmit = () => {
    loadPcBuilds();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            <CardTitle>Quản lý PC Build</CardTitle>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm PC Build
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm PC Build..."
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
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên PC Build</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPcBuilds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPcBuilds.map((pcBuild) => (
                    <TableRow key={pcBuild.id}>
                      <TableCell>
                        {pcBuild.thumbnail ? (
                          <img
                            src={pcBuild.thumbnail}
                            alt={pcBuild.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              No Image
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {pcBuild.productName}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(pcBuild.price)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {pcBuild.subCategoryName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(pcBuild.status)}>
                          {getStatusText(pcBuild.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pcBuild.description ? (
                          <span className="text-sm text-muted-foreground">
                            {pcBuild.description.length > 50
                              ? `${pcBuild.description.substring(0, 50)}...`
                              : pcBuild.description}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Chưa có mô tả
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(pcBuild)}
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(pcBuild)}
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageItems(pcBuild)}
                            title="Quản lý linh kiện"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(pcBuild)}
                            title="Xóa"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PcBuildDialog
        open={dialogOpen}
        mode={dialogMode}
        data={selectedPcBuild}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}
