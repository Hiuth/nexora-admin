"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "@/types";
import {
  pcBuildItemService,
  productService,
  brandService,
  categoryService,
} from "@/lib/api";
import { toast } from "sonner";
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
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  // Filter states
  const [selectedBrandId, setSelectedBrandId] = useState<string>("all");
  const [selectedFilterCategoryId, setSelectedFilterCategoryId] =
    useState<string>("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

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
      loadProducts();
      loadBrands();
      loadCategories();
    }
  }, [open]);

  // Load products by category
  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [selectedBrandId, selectedFilterCategoryId, open]);

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
      setPriceRange({ min: "", max: "" });
      setShowFilters(false);
    }
  }, [open]);

  // Filter products based on search term and filters
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange.min && !isNaN(Number(priceRange.min))) {
      filtered = filtered.filter(
        (product) => product.price >= Number(priceRange.min)
      );
    }
    if (priceRange.max && !isNaN(Number(priceRange.max))) {
      filtered = filtered.filter(
        (product) => product.price <= Number(priceRange.max)
      );
    }

    return filtered;
  }, [products, searchTerm, priceRange]);

  // Get selected product details
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId);
  }, [products, selectedProductId]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      let response;

      // Apply filters in API calls
      if (selectedBrandId && selectedBrandId !== "all") {
        response = await productService.getByBrandId(selectedBrandId);
      } else {
        response = await productService.getAll();
      }

      if (response.code === 1000 && response.result) {
        const paginatedData = response.result;
        let filteredProducts =
          (paginatedData as any).items || paginatedData || [];

        // Handle both paginated response (with .items) and direct array response
        if (Array.isArray(paginatedData)) {
          filteredProducts = paginatedData;
        }

        // Filter by category if needed (client-side since API might not support category filter)
        if (selectedFilterCategoryId && selectedFilterCategoryId !== "all") {
          filteredProducts = filteredProducts.filter(
            (product: ProductResponse) =>
              product.categoryId === selectedFilterCategoryId
          );
        }

        setProducts(filteredProducts);
      } else {
        setProducts([]);
        console.warn(
          "API returned non-success code:",
          response.code,
          response.message
        );
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

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
    setPriceRange({ min: "", max: "" });
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Filters */}
            <ProductFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedBrandId={selectedBrandId}
              onBrandChange={setSelectedBrandId}
              selectedCategoryId={selectedFilterCategoryId}
              onCategoryChange={setSelectedFilterCategoryId}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              brands={brands}
              categories={categories}
              disabled={loading || loadingProducts}
              resultCount={filteredProducts.length}
            />

            {/* Product List */}
            <ProductList
              products={filteredProducts}
              selectedProductId={selectedProductId}
              onProductSelect={handleProductSelect}
              loading={loadingProducts}
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

            <div className="flex justify-end space-x-2 pt-4 border-t">
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
