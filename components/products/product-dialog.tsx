"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  ProductResponse,
  BrandResponse,
  SubCategoryResponse,
  DialogMode,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types";
import {
  productService,
  brandService,
  subCategoryService,
  productImgService,
} from "@/lib/api";

interface ProductDialogProps {
  open: boolean;
  mode: DialogMode;
  data?: ProductResponse;
  onClose: () => void;
  onSubmit: () => void;
}

export function ProductDialog({
  open,
  mode,
  data,
  onClose,
  onSubmit,
}: ProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [formData, setFormData] = useState({
    productName: "",
    price: 0,
    stockQuantity: 0,
    description: "",
    status: "ACTIVE",
    warrantyPeriod: 12,
    brandId: "",
    subCategoryId: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  useEffect(() => {
    if (open) {
      loadBrands();
      loadSubCategories();
      if (mode === "edit" && data) {
        setFormData({
          productName: data.productName,
          price: data.price,
          stockQuantity: data.stockQuantity,
          description: data.description || "",
          status: data.status,
          warrantyPeriod: data.warrantyPeriod,
          brandId: data.brandId,
          subCategoryId: data.subCategoryId,
        });
      } else {
        setFormData({
          productName: "",
          price: 0,
          stockQuantity: 0,
          description: "",
          status: "ACTIVE",
          warrantyPeriod: 12,
          brandId: "",
          subCategoryId: "",
        });
      }
      setThumbnail(null);
      setAdditionalImages([]);
    }
  }, [open, mode, data]);

  const loadBrands = async () => {
    try {
      const response = await brandService.getAll();
      if (response.code === 1000 && response.result) {
        setBrands(response.result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách thương hiệu");
    }
  };

  const loadSubCategories = async () => {
    try {
      const response = await subCategoryService.getAll();
      if (response.code === 1000 && response.result) {
        setSubCategories(response.result);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục con");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        if (!thumbnail) {
          toast.error("Vui lòng chọn ảnh thumbnail");
          return;
        }

        const request: CreateProductRequest = {
          productName: formData.productName,
          price: formData.price,
          stockQuantity: formData.stockQuantity,
          description: formData.description,
          status: formData.status,
          warrantyPeriod: formData.warrantyPeriod,
          brandId: formData.brandId,
          subCategoryId: formData.subCategoryId,
        };

        const productResponse = await productService.create(
          formData.brandId,
          request,
          thumbnail,
          formData.subCategoryId
        );

        if (productResponse.code === 1000 && productResponse.result) {
          // Upload additional images if any
          if (additionalImages.length > 0) {
            await uploadAdditionalImages(productResponse.result.id);
          }
          toast.success("Tạo sản phẩm thành công");
        }
      } else if (mode === "edit" && data) {
        // Update logic (chỉ gửi fields thay đổi)
        const request: Partial<UpdateProductRequest> = {};
        let brandId = data.brandId;
        let subCategoryId = data.subCategoryId;

        if (formData.productName !== data.productName) {
          request.productName = formData.productName;
        }
        if (formData.price !== data.price) {
          request.price = formData.price;
        }
        if (formData.stockQuantity !== data.stockQuantity) {
          request.stockQuantity = formData.stockQuantity;
        }
        if (formData.description !== data.description) {
          request.description = formData.description;
        }
        if (formData.status !== data.status) {
          request.status = formData.status;
        }
        if (formData.warrantyPeriod !== data.warrantyPeriod) {
          request.warrantyPeriod = formData.warrantyPeriod;
        }
        if (formData.brandId !== data.brandId) {
          brandId = formData.brandId;
        }
        if (formData.subCategoryId !== data.subCategoryId) {
          subCategoryId = formData.subCategoryId;
        }

        if (
          Object.keys(request).length > 0 ||
          thumbnail ||
          formData.brandId !== data.brandId ||
          formData.subCategoryId !== data.subCategoryId
        ) {
          await productService.update(
            data.id,
            request as UpdateProductRequest,
            thumbnail || undefined,
            brandId,
            subCategoryId
          );

          // Upload additional images if any
          if (additionalImages.length > 0) {
            await uploadAdditionalImages(data.id);
          }

          toast.success("Cập nhật sản phẩm thành công");
        } else {
          toast.info("Không có thay đổi nào để cập nhật");
        }
      }

      onSubmit();
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const uploadAdditionalImages = async (productId: string) => {
    try {
      for (const image of additionalImages) {
        await productImgService.create(productId, image);
      }
      toast.success(`Đã tải lên ${additionalImages.length} ảnh bổ sung`);
    } catch (error) {
      toast.error("Có lỗi khi tải ảnh bổ sung");
    }
  };

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setAdditionalImages(Array.from(e.target.files));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo sản phẩm mới" : "Chỉnh sửa sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Tên sản phẩm</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    productName: e.target.value,
                  }))
                }
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                placeholder="0"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Số lượng</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stockQuantity: Number(e.target.value),
                  }))
                }
                placeholder="0"
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyPeriod">Thời hạn bảo hành (tháng)</Label>
              <Input
                id="warrantyPeriod"
                type="number"
                value={formData.warrantyPeriod}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    warrantyPeriod: Number(e.target.value),
                  }))
                }
                placeholder="12"
                required
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brandId">Thương hiệu</Label>
              <Select
                value={formData.brandId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, brandId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.brandName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subCategoryId">Danh mục con</Label>
              <Select
                value={formData.subCategoryId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subCategoryId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục con" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id}>
                      {subCategory.subCategoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Nhập mô tả sản phẩm"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Ảnh thumbnail</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              required={mode === "create"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalImages">
              Ảnh bổ sung (có thể chọn nhiều ảnh)
            </Label>
            <Input
              id="additionalImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImagesChange}
            />
            <p className="text-xs text-muted-foreground">
              Bạn có thể chọn nhiều ảnh cùng lúc. Ảnh sẽ được tải lên sau khi
              tạo/cập nhật sản phẩm thành công.
            </p>
            {additionalImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Đã chọn {additionalImages.length} ảnh:
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {additionalImages.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                    >
                      <div className="flex-1 truncate">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-muted-foreground ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAdditionalImage(index)}
                        className="ml-2 h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Đang xử lý..."
                : mode === "create"
                ? "Tạo"
                : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
