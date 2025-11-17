"use client";

import { useState, useEffect } from "react";
import { ProductResponse, ProductImgResponse } from "@/types";
import { productImgService } from "@/lib/api";
import { EnhancedImage } from "@/components/ui/enhanced-image";
import { SuperEnhancedImage } from "@/components/ui/super-enhanced-image";

interface ProductImageGalleryProps {
  product: ProductResponse;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [productImages, setProductImages] = useState<ProductImgResponse[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // 0 = thumbnail
  const [allImages, setAllImages] = useState<{ url: string; alt: string }[]>(
    []
  );

  useEffect(() => {
    loadProductImages();
  }, [product.id]);

  useEffect(() => {
    // Combine thumbnail and additional images
    const images = [];
    if (product.thumbnail) {
      images.push({
        url: product.thumbnail,
        alt: `${product.productName} - Ảnh chính`,
      });
    }
    productImages.forEach((img, index) => {
      images.push({
        url: img.imgUrl,
        alt: `${product.productName} - Ảnh ${index + 1}`,
      });
    });
    setAllImages(images);
  }, [product.thumbnail, productImages, product.productName]);

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

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold border-b border-muted pb-2">
        Hình ảnh sản phẩm
      </h4>

      {/* Main Display Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden border border-border shadow-sm max-w-xs mx-auto">
        {allImages.length > 0 && allImages[selectedImageIndex] ? (
          <div className="relative w-full h-full group enhanced-image-container">
            <SuperEnhancedImage
              src={allImages[selectedImageIndex].url}
              alt={allImages[selectedImageIndex].alt}
              fill
              className="object-cover main-image-enhanced"
              sizes="300px"
              quality={100}
              enhance={true}
              upscaleFactor={3}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
            <span className="text-muted-foreground text-sm">
              Không có hình ảnh
            </span>
          </div>
        )}
      </div>

      {/* All Images Thumbnail Grid */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-foreground">
          Tất cả ảnh {allImages.length > 0 && `(${allImages.length})`}
        </h5>
        {loadingImages ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2 text-xs">
              Đang tải ảnh...
            </p>
          </div>
        ) : allImages.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((img, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer hover:shadow-md transition-all duration-200 enhanced-image-container ${
                  selectedImageIndex === index
                    ? "border-primary border-2 ring-2 ring-primary/20"
                    : "border-border hover:border-primary"
                }`}
                onClick={() => handleImageClick(index)}
              >
                <SuperEnhancedImage
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover thumbnail-enhanced"
                  sizes="80px"
                  quality={100}
                  enhance={true}
                  upscaleFactor={4}
                />

                {/* Selected indicator */}
                {selectedImageIndex === index && (
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                )}

                {/* Image type badge */}
                <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded text-[10px]">
                  {index === 0 ? "Chính" : index}
                </div>
              </div>
            ))}
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
