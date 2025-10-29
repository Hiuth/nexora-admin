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
import { Eye, Edit, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { SubCategoryResponse, DialogMode } from "@/types";
import { subCategoryService } from "@/lib/api";
import { SubCategoryDialog } from "./subcategory-dialog";

export function SubCategoryTable() {
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    SubCategoryResponse | undefined
  >();

  useEffect(() => {
    loadSubCategories();
  }, []);

  const loadSubCategories = async () => {
    try {
      setLoading(true);
      const response = await subCategoryService.getAll();
      if (response.Code === 1000 && response.Result) {
        setSubCategories(response.Result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục con");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubCategories = subCategories.filter(
    (subCategory) =>
      subCategory.subCategoryName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      subCategory.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedSubCategory(undefined);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEdit = (subCategory: SubCategoryResponse) => {
    setSelectedSubCategory(subCategory);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleView = (subCategory: SubCategoryResponse) => {
    setSelectedSubCategory(subCategory);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSubCategory(undefined);
  };

  const handleDialogSubmit = () => {
    loadSubCategories();
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
            <CardTitle>Quản lý danh mục con</CardTitle>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm danh mục con
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục con..."
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
                  <TableHead>Tên danh mục con</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Danh mục cha</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubCategories.map((subCategory) => (
                    <TableRow key={subCategory.id}>
                      <TableCell>
                        {subCategory.subCategoryImg ? (
                          <img
                            src={subCategory.subCategoryImg}
                            alt={subCategory.subCategoryName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              No Image
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {subCategory.subCategoryName}
                      </TableCell>
                      <TableCell>
                        {subCategory.description ? (
                          <span className="text-sm text-muted-foreground">
                            {subCategory.description.length > 50
                              ? `${subCategory.description.substring(0, 50)}...`
                              : subCategory.description}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Chưa có mô tả
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {subCategory.categoryId}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(subCategory)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(subCategory)}
                          >
                            <Edit className="w-4 h-4" />
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

      <SubCategoryDialog
        open={dialogOpen}
        mode={dialogMode}
        data={selectedSubCategory}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}
