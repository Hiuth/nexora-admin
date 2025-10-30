"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ProductResponse, ProductImgResponse } from "@/types";
import { productImgService } from "@/lib/api";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductImageModal } from "./product-image-modal";
import { ProductBasicInfo } from "./product-basic-info";
import { ProductDetailSection } from "./product-detail-section";

interface ProductDetailDialogProps {
  product: ProductResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
}: ProductDetailDialogProps) {
  const [productImages, setProductImages] = useState<ProductImgResponse[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const loadProductImages = async (productId: string) => {
    try {
      console.log("Loading images for product:", productId);
      const response = await productImgService.getByProductId(productId);
      console.log("Images response:", response);

      if (response.code === 1000 && response.result) {
        setProductImages(response.result);
        console.log("Loaded", response.result.length, "images for product");
      } else {
        console.log("No images found or API error:", response);
        setProductImages([]);
      }
    } catch (error) {
      console.error("Error loading product images:", error);
      setProductImages([]);
    }
  };

  useEffect(() => {
    if (product?.id) {
      loadProductImages(product.id);
    }
    // Reset state when dialog closes
    if (!open) {
      setProductImages([]);
      setSelectedImageIndex(0);
      setIsImageModalOpen(false);
    }
  }, [product?.id, open]);

  if (!product) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Match width with main content (ProductTable container uses max-w-7xl) */}
        <DialogContent className="w-full max-w-7xl sm:max-w-7xl h-[95vh] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center mb-2">
              Chi tiết sản phẩm
            </DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-3 gap-6 h-full">
            {/* Cột trái - Thông tin chính (2/3 width) */}
            <div className="lg:col-span-2 space-y-4">
              <ProductBasicInfo product={product} />

              <Separator className="bg-gray-700" />

              <ProductDetailSection product={product} />
            </div>

            {/* Cột phải - Hình ảnh compact (1/3 width) */}
            <div className="lg:col-span-1 space-y-4">
              <ProductImageGallery
                product={product}
                onImageClick={(index) => {
                  // Modal disabled - only gallery interaction
                  // setSelectedImageIndex(index);
                  // setIsImageModalOpen(true);
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal xem ảnh toàn màn hình - DISABLED */}
      {/* 
      <ProductImageModal
        open={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        product={product}
        productImages={productImages}
        selectedImageIndex={selectedImageIndex}
        onImageChange={setSelectedImageIndex}
      />
      */}
    </>
  );
}
