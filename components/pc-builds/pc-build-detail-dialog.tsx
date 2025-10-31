"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PcBuildResponse, ProductImgResponse } from "@/types";
import { productImgService } from "@/lib/api";
import { PcBuildImageGallery } from "@/components/pc-builds/pc-build-image-gallery";
import { PcBuildBasicInfo } from "@/components/pc-builds/pc-build-basic-info";
import { PcBuildDetailSection } from "@/components/pc-builds/pc-build-detail-section";

interface PcBuildDetailDialogProps {
  pcBuild: PcBuildResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PcBuildDetailDialog({
  pcBuild,
  open,
  onOpenChange,
}: PcBuildDetailDialogProps) {
  const [pcBuildImages, setPcBuildImages] = useState<ProductImgResponse[]>([]);

  const loadPcBuildImages = async (pcBuildId: string) => {
    try {
      console.log("Loading images for PC Build:", pcBuildId);
      const response = await productImgService.getByProductId(pcBuildId);
      console.log("Images response:", response);

      if (response.code === 1000 && response.result) {
        setPcBuildImages(response.result);
        console.log("Loaded", response.result.length, "images for PC Build");
      } else {
        console.log("No images found or API error:", response);
        setPcBuildImages([]);
      }
    } catch (error) {
      console.error("Error loading PC Build images:", error);
      setPcBuildImages([]);
    }
  };

  useEffect(() => {
    if (pcBuild?.id) {
      loadPcBuildImages(pcBuild.id);
    }
    // Reset state when dialog closes
    if (!open) {
      setPcBuildImages([]);
    }
  }, [pcBuild?.id, open]);

  if (!pcBuild) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Match width with main content */}
      <DialogContent className="w-full max-w-7xl sm:max-w-7xl h-[95vh] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center mb-2">
            Chi tiết PC Build
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6 h-full">
          {/* Cột trái - Thông tin chính (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            <PcBuildBasicInfo pcBuild={pcBuild} />

            <Separator className="bg-gray-700" />

            <PcBuildDetailSection pcBuild={pcBuild} />
          </div>

          {/* Cột phải - Hình ảnh compact (1/3 width) */}
          <div className="lg:col-span-1 space-y-4">
            <PcBuildImageGallery
              pcBuild={pcBuild}
              onImageClick={(_index: number) => {
                // Modal disabled - only gallery interaction
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
