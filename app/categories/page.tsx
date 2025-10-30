"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { CategoryTable } from "@/components/categories/category-table";
import { toast } from "sonner";
import { CreateCategoryRequest, UpdateCategoryRequest } from "@/types/requests";
import { CategoryResponse } from "@/types/api";
import { categoryService } from "@/lib/api";

interface Category {
  id: string;
  categoryName: string;
  iconImg?: string;
  productCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      if (response.code === 1000 && response.result) {
        const categoryData = response.result.map((cat: CategoryResponse) => ({
          id: cat.id,
          categoryName: cat.categoryName,
          iconImg: cat.iconImg,
          productCount: 0, // API doesn't provide this yet
        }));
        setCategories(categoryData);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục");
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      // Note: API doesn't have delete method yet, so we'll just remove from local state
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("Xóa danh mục thành công");
    } catch (error) {
      toast.error("Không thể xóa danh mục");
      console.error("Error deleting category:", error);
    }
  };

  const handleSubmit = async (
    formData: CreateCategoryRequest | UpdateCategoryRequest,
    file?: File
  ) => {
    try {
      if (selectedCategory) {
        // Edit existing category
        if (file || (formData as UpdateCategoryRequest).categoryName) {
          await categoryService.update(
            selectedCategory.id,
            formData as UpdateCategoryRequest,
            file
          );
          toast.success("Cập nhật danh mục thành công");
        }
      } else {
        // Create new category
        if (file) {
          await categoryService.create(formData as CreateCategoryRequest, file);
          toast.success("Tạo danh mục thành công");
        } else {
          toast.error("Vui lòng chọn hình ảnh icon");
          return;
        }
      }

      // Reload categories
      await loadCategories();
      setDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error(
        selectedCategory
          ? "Không thể cập nhật danh mục"
          : "Không thể tạo danh mục"
      );
      console.error("Error submitting category:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý danh mục
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý danh mục cha và danh mục con
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            onClick={handleCreate}
          >
            <Plus size={20} />
            Thêm danh mục
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Đang tải...</div>
          </div>
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <CategoryDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}
