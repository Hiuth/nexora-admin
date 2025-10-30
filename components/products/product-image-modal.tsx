"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductResponse, ProductImgResponse } from "@/types";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductImageModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductResponse;
  productImages: ProductImgResponse[];
  selectedImageIndex: number;
  onImageChange: (index: number) => void;
}

export function ProductImageModal({
  open,
  onClose,
  product,
  productImages,
  selectedImageIndex,
  onImageChange,
}: ProductImageModalProps) {
  if (!open) return null;

  // Combine thumbnail and additional images for modal
  const allModalImages = [];
  if (product.thumbnail) {
    allModalImages.push({
      url: product.thumbnail,
      alt: `${product.productName} - Ảnh chính`,
      isMain: true,
    });
  }
  productImages.forEach((img, index) => {
    allModalImages.push({
      url: img.imgUrl,
      alt: `${product.productName} - Ảnh ${index + 1}`,
      isMain: false,
    });
  });

  const validIndex = Math.max(
    0,
    Math.min(selectedImageIndex, allModalImages.length - 1)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 m-0">
        <div className="relative bg-black h-full w-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>

          {allModalImages.length > 0 ? (
            <div className="relative h-full">
              {/* Main Image */}
              <div className="relative h-[90vh] flex items-center justify-center">
                <Image
                  src={allModalImages[validIndex]?.url}
                  alt={allModalImages[validIndex]?.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Navigation Arrows */}
              {allModalImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      onImageChange(
                        validIndex === 0
                          ? allModalImages.length - 1
                          : validIndex - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() =>
                      onImageChange(
                        validIndex === allModalImages.length - 1
                          ? 0
                          : validIndex + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                {validIndex + 1} / {allModalImages.length}
              </div>

              {/* Thumbnail Strip */}
              {allModalImages.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                  <div className="flex gap-2 max-w-md overflow-x-auto">
                    {allModalImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => onImageChange(index)}
                        className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                          index === validIndex
                            ? "border-white"
                            : "border-transparent hover:border-white/50"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        {img.isMain && (
                          <div className="absolute top-0 left-0 bg-primary text-white text-xs px-1 rounded-br">
                            Chính
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[90vh] flex items-center justify-center">
              <span className="text-white text-xl">
                Không có ảnh để hiển thị
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
