"use client";

import { useState, useEffect } from "react";
import { ProductResponse, ProductImgResponse } from "@/types";
import { productImgService } from "@/lib/api";
import Image from "next/image";

interface ProductImageGalleryProps {
  product: ProductResponse;
  onImageClick: (index: number) => void;
}

export function ProductImageGallery({
  product,
  onImageClick,
}: ProductImageGalleryProps) {
  const [productImages, setProductImages] = useState<ProductImgResponse[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    loadProductImages();
  }, [product.id]);

  const loadProductImages = async () => {
    try {
      setLoadingImages(true);
      console.log("Fetching images for product ID:", product.id);

      const response = await productImgService.getByProductId(product.id);
      console.log("Product images response:", response);

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
    } finally {
      setLoadingImages(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold border-b border-muted pb-2">
        Hình ảnh sản phẩm
      </h4>

      {/* Main Image - Smaller size */}
      <div className="relative aspect-square rounded-lg overflow-hidden border border-border shadow-sm max-w-xs mx-auto">
        {product.thumbnail ? (
          <div
            className="relative w-full h-full cursor-pointer group"
            onClick={() => onImageClick(0)}
          >
            <Image
              src={product.thumbnail}
              alt={product.productName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="300px"
            />
            {/* Overlay hiệu ứng khi hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium text-sm">
                Xem ảnh
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
            <span className="text-muted-foreground text-sm">
              Không có hình ảnh
            </span>
          </div>
        )}
      </div>

      {/* Additional Images Thumbnail - Compact grid */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-foreground">
          Ảnh chi tiết {productImages.length > 0 && `(${productImages.length})`}
        </h5>
        {loadingImages ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2 text-xs">
              Đang tải ảnh...
            </p>
          </div>
        ) : productImages.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {productImages.slice(0, 8).map((img, index) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-md overflow-hidden border border-border cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200 group"
                onClick={() => onImageClick(index)}
              >
                <Image
                  src={img.imgUrl}
                  alt={`${product.productName} - Ảnh ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="80px"
                />

                {/* Overlay number badge */}
                <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded text-[10px]">
                  {index + 1}
                </div>
              </div>
            ))}
            {productImages.length > 8 && (
              <div
                className="relative aspect-square rounded-md overflow-hidden border border-border cursor-pointer bg-muted flex items-center justify-center"
                onClick={() => onImageClick(8)}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  +{productImages.length - 8}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 bg-muted/20 rounded-lg">
            <div className="text-muted-foreground text-xs">
              Không có ảnh chi tiết
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
