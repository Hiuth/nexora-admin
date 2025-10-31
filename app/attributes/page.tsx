"use client";

import { useState } from "react";
import { Plus, Filter, Search } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { AttributeDialog } from "@/components/attributes/attribute-dialog";
import { AttributeTable } from "@/components/attributes/attribute-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAttributes, AttributeWithCategory } from "@/hooks/use-attributes";

export default function AttributesPage() {
  const {
    attributes,
    categories,
    loading,
    creating,
    updating,
    deleting,
    selectedCategoryId,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    filterByCategory,
  } = useAttributes();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] =
    useState<AttributeWithCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter attributes by search term
  const filteredAttributes = attributes.filter(
    (attr) =>
      attr.attributeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (attr.categoryName &&
        attr.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = () => {
    setEditingAttribute(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (attribute: AttributeWithCategory) => {
    setEditingAttribute(attribute);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (categoryId: string, attributeName: string) => {
    if (editingAttribute) {
      return await updateAttribute(
        editingAttribute.id,
        categoryId,
        attributeName
      );
    } else {
      return await createAttribute(categoryId, attributeName);
    }
  };

  const handleDelete = async (attributeId: string) => {
    return await deleteAttribute(attributeId);
  };

  const handleCategoryFilter = (categoryId: string) => {
    if (categoryId === "all") {
      filterByCategory("");
    } else {
      filterByCategory(categoryId);
    }
  };

  const clearCategoryFilter = () => {
    filterByCategory("");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý thuộc tính
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý các thuộc tính sản phẩm theo danh mục
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="flex items-center gap-2"
            disabled={creating || updating}
          >
            <Plus size={20} />
            Thêm thuộc tính
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên thuộc tính hoặc danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select
              value={selectedCategoryId || "all"}
              onValueChange={handleCategoryFilter}
            >
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Lọc theo danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCategoryId && selectedCategoryId !== "all" && (
              <Button variant="outline" onClick={clearCategoryFilter} size="sm">
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {filteredAttributes.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedCategoryId
                ? "Thuộc tính được hiển thị"
                : "Tổng số thuộc tính"}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {categories.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Tổng số danh mục
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {selectedCategoryId ? 1 : categories.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Danh mục được chọn
            </div>
          </div>
        </div>

        {/* Table */}
        <AttributeTable
          attributes={filteredAttributes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          deleting={deleting}
        />

        {/* Dialog */}
        <AttributeDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          attribute={editingAttribute}
          categories={categories}
          onSubmit={handleSubmit}
          loading={creating || updating}
        />
      </div>
    </AdminLayout>
  );
}
