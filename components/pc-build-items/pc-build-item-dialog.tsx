"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useProductsInfinite } from "@/hooks/use-products-infinite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import {
  PcBuildItemResponse,
  ProductResponse,
  BrandResponse,
  CategoryResponse,
  SubCategoryResponse,
} from "@/types";
import {
  pcBuildItemService,
  productService,
  brandService,
  categoryService,
  subCategoryService,
} from "@/lib/api";
import { toast } from "sonner";
import { debounce } from "@/lib/utils";
import { ProductFilters } from "./product-filters";
import { ProductList } from "./product-list";
import { SelectedProductPreview } from "./selected-product-preview";

const formSchema = z.object({
  productId: z.string().min(1, "Vui lòng chọn sản phẩm"),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
});

type FormData = z.infer<typeof formSchema>;

interface PcBuildItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pcBuildId: string;
  selectedCategoryId: string;
  pcBuildItem?: PcBuildItemResponse | null;
  onSuccess: () => void;
}

export function PcBuildItemDialog({
  open,
  onOpenChange,
  pcBuildId,
  selectedCategoryId,
  pcBuildItem,
  onSuccess,
}: PcBuildItemDialogProps) {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  // Filter states
  const [selectedBrandId, setSelectedBrandId] = useState<string>("all");
  const [selectedFilterCategoryId, setSelectedFilterCategoryId] =
    useState<string>("all");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Use infinite scroll hook for products
  const {
    products,
    loading: loadingProducts,
    loadingMore,
    hasMore,
    totalItems,
    fetchProducts,
    loadMoreProducts,
    reset: resetProducts
  } = useProductsInfinite();

  const isEditing = !!pcBuildItem;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
    },
  });

  // Load initial data
  useEffect(() => {
    if (open) {
      loadBrands();
      loadCategories();
      loadSubCategories();
      // Reset and fetch products with initial filters
      resetProducts();
      setTimeout(() => {
        fetchProducts({
          search: searchTerm,
          brandId: selectedBrandId === "all" ? undefined : selectedBrandId,
          subCategoryId: selectedSubCategoryId === "all" ? undefined : selectedSubCategoryId,
        });
      }, 100);
    }
  }, [open]);

  // Debounced search to reduce API calls and make search smoother
  const debouncedFetchProducts = useCallback(
    debounce((search: string, brand: string, subCategory: string) => {
      if (open) {
        setSearchLoading(true);
        resetProducts();
        setTimeout(() => {
          fetchProducts({
            search: search || undefined,
            brandId: brand === "all" ? undefined : brand,
            subCategoryId: subCategory === "all" ? undefined : subCategory,
          }).finally(() => {
            setSearchLoading(false);
          });
        }, 100);
      }
    }, 500), // 500ms delay
    [open, resetProducts, fetchProducts]
  );

  // Reset and fetch when filters change (with debounce for search)
  useEffect(() => {
    debouncedFetchProducts(searchTerm, selectedBrandId, selectedSubCategoryId);
  }, [searchTerm, selectedBrandId, selectedSubCategoryId, debouncedFetchProducts]);

  // Reset products when dialog opens
  useEffect(() => {
    if (open) {
      resetProducts();
    }
  }, [open]);

  // Set form values when editing
  useEffect(() => {
    if (pcBuildItem) {
      form.reset({
        productId: pcBuildItem.productId,
        quantity: pcBuildItem.quantity,
      });
      setSelectedProductId(pcBuildItem.productId);
    } else {
      form.reset({
        productId: "",
        quantity: 1,
      });
      setSelectedProductId("");
    }
  }, [pcBuildItem, form]);

  // Reset search when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setSelectedProductId("");
      setSelectedBrandId("all");
      setSelectedFilterCategoryId("all");
      setSelectedSubCategoryId("all");
      setPriceRange({ min: "", max: "" });
      setShowFilters(false);
    }
  }, [open]);

  // Get selected product details
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId);
  }, [products, selectedProductId]);

  const loadBrands = async () => {
    try {
      const response = await brandService.getAll();
      if (response.code === 1000 && response.result) {
        setBrands(Array.isArray(response.result) ? response.result : []);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error("Error loading brands:", error);
      setBrands([]);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.code === 1000 && response.result) {
        setCategories(Array.isArray(response.result) ? response.result : []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    }
  };

  const loadSubCategories = async () => {
    try {
      const response = await subCategoryService.getAll();
      if (response.code === 1000 && response.result) {
        setSubCategories(Array.isArray(response.result) ? response.result : []);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Error loading subcategories:", error);
      setSubCategories([]);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (isEditing && pcBuildItem) {
        // Check what has actually changed
        const hasProductChanged = data.productId !== pcBuildItem.productId;
        const hasQuantityChanged = data.quantity !== pcBuildItem.quantity;

        // Only proceed if something has changed
        if (!hasProductChanged && !hasQuantityChanged) {
          toast.info("Không có thay đổi nào để cập nhật");
          onOpenChange(false);
          return;
        }

        // Prepare update data with only changed fields
        const updateData: { quantity?: number } = {};
        if (hasQuantityChanged) {
          updateData.quantity = data.quantity;
        }

        // Update PC Build Item - only send productId if it changed, otherwise undefined
        const response = await pcBuildItemService.update(
          pcBuildItem.id,
          hasProductChanged ? data.productId : undefined,
          Object.keys(updateData).length > 0 ? updateData : undefined
        );

        if (response.code === 1000) {
          toast.success("Cập nhật linh kiện thành công");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(response.message || "Không thể cập nhật linh kiện");
        }
      } else {
        // Create PC Build Item
        const response = await pcBuildItemService.create(
          pcBuildId,
          data.productId,
          { quantity: data.quantity }
        );
        if (response.code === 1000) {
          toast.success("Thêm linh kiện thành công");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(response.message || "Không thể thêm linh kiện");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSearchTerm("");
    setSelectedProductId("");
    setSelectedBrandId("all");
    setSelectedFilterCategoryId("all");
    setSelectedSubCategoryId("all");
    setPriceRange({ min: "", max: "" });
    setShowFilters(false);
    onOpenChange(false);
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    form.setValue("productId", productId);
  };

  const clearFilters = () => {
    setSelectedBrandId("all");
    setSelectedFilterCategoryId("all");
    setSelectedSubCategoryId("all");
    setPriceRange({ min: "", max: "" });
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isEditing ? "Chỉnh Sửa Linh Kiện" : "Thêm Linh Kiện Mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin linh kiện trong cấu hình máy tính"
              : "Tìm kiếm và thêm linh kiện mới vào cấu hình máy tính"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 max-h-[calc(90vh-240px)]">
              {/* Product Filters */}
              <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedBrandId={selectedBrandId}
                onBrandChange={setSelectedBrandId}
                selectedCategoryId={selectedFilterCategoryId}
                onCategoryChange={setSelectedFilterCategoryId}
                selectedSubCategoryId={selectedSubCategoryId}
                onSubCategoryChange={setSelectedSubCategoryId}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                brands={brands}
                categories={categories}
                subCategories={subCategories}
                disabled={loading || loadingProducts}
                searchLoading={searchLoading}
                resultCount={products.length}
              />

            {/* Product List */}
            <ProductList
              products={products}
              selectedProductId={selectedProductId}
              onProductSelect={handleProductSelect}
              loading={loadingProducts}
              loadingMore={loadingMore}
              hasMore={hasMore}
              totalItems={totalItems}
              onLoadMore={loadMoreProducts}
              emptyMessage={
                searchTerm
                  ? "Không tìm thấy sản phẩm phù hợp"
                  : "Không có sản phẩm nào"
              }
            />

            {/* Selected Product Preview */}
            <SelectedProductPreview product={selectedProduct} />

            {/* Hidden form field for productId */}
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            </div>

            {/* Fixed bottom section with quantity and actions */}
            <div className="border-t pt-4 mt-4 bg-white space-y-4">
              {/* Quantity Input */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số Lượng</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                        disabled={loading}
                        className="w-32"
                      />
                    </FormControl>
                    <FormDescription>
                      Số lượng sản phẩm trong cấu hình
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={loading || !selectedProductId}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Cập Nhật" : "Thêm Mới"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
