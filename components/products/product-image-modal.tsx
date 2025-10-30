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

          {productImages.length > 0 ? (
            <div className="relative h-full">
              {/* Main Image */}
              <div className="relative h-[90vh] flex items-center justify-center">
                <Image
                  src={productImages[selectedImageIndex]?.imgUrl}
                  alt={`${product.productName} - Ảnh ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      onImageChange(
                        selectedImageIndex === 0
                          ? productImages.length - 1
                          : selectedImageIndex - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() =>
                      onImageChange(
                        selectedImageIndex === productImages.length - 1
                          ? 0
                          : selectedImageIndex + 1
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
                {selectedImageIndex + 1} / {productImages.length}
              </div>

              {/* Thumbnail Strip */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                  <div className="flex gap-2 max-w-md overflow-x-auto">
                    {productImages.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => onImageChange(index)}
                        className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                          index === selectedImageIndex
                            ? "border-white"
                            : "border-transparent hover:border-white/50"
                        }`}
                      >
                        <Image
                          src={img.imgUrl}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
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
