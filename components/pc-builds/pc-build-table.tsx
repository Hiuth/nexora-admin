"use client";

import { useState } from "react";
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
import { PcBuildResponse, DialogMode } from "@/types";
import { PcBuildDialogNew } from "./pc-build-dialog-new";
import { getStatusColor, getStatusText, formatCurrency } from "@/lib/api-utils";
import { usePcBuildsContext } from "./pc-builds-context";

export function PcBuildTable() {
  const {
    pcBuilds,
    categories,
    subCategories,
    loading,
    creating,
    updating,
    deleting,
    currentPage,
    totalPages,
    totalCount,
    createPcBuild,
    updatePcBuild,
    deletePcBuild,
    loadSubCategoriesByCategoryId,
    changePage,
  } = usePcBuildsContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [selectedPcBuild, setSelectedPcBuild] = useState<
    PcBuildResponse | undefined
  >();

  // Filter PC Builds based on search term
  const filteredPcBuilds = pcBuilds.filter(
    (pcBuild) =>
      pcBuild.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pcBuild.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pcBuild.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pcBuild.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (
      confirm(`Bạn có chắc chắn muốn xóa PC Build "${pcBuild.productName}"?`)
    ) {
      await deletePcBuild(pcBuild.id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedPcBuild(undefined);
  };

  const handlePageChange = (page: number) => {
    changePage(page);
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
            <div>
              <CardTitle>Quản lý PC Build</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tổng cộng: {totalCount} PC Build
              </p>
            </div>
            <Button onClick={handleCreate} disabled={creating}>
              <Plus className="w-4 h-4 mr-2" />
              {creating ? "Đang tạo..." : "Thêm PC Build"}
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
                  <TableHead>Danh mục con</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPcBuilds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      {searchTerm
                        ? "Không tìm thấy PC Build nào"
                        : "Chưa có PC Build nào"}
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
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
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
                          {pcBuild.categoryName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
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
                            disabled={updating}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(pcBuild)}
                            title="Xóa"
                            className="text-red-600 hover:text-red-700"
                            disabled={deleting === pcBuild.id}
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

      <PcBuildDialogNew
        open={dialogOpen}
        mode={dialogMode}
        data={selectedPcBuild}
        onClose={handleDialogClose}
        onSubmit={() => {
          // Refresh data after successful operation
          // The hook handles this automatically
        }}
      />
    </div>
  );
}
