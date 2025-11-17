"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SuperEnhancedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  onClick?: () => void;
  enhance?: boolean;
  upscaleFactor?: number; // 2x, 3x, 4x upscaling
}

export function SuperEnhancedImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  sizes,
  quality = 100,
  priority,
  onClick,
  enhance = true,
  upscaleFactor = 2,
  ...props
}: SuperEnhancedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [enhancedSrc, setEnhancedSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas-based upscaling for small images
  const upscaleImage = async (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // Set canvas size to upscaled dimensions
        canvas.width = img.width * upscaleFactor;
        canvas.height = img.height * upscaleFactor;

        // Disable smoothing for pixel-perfect upscaling
        ctx.imageSmoothingEnabled = false;

        // Draw the image scaled up
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Apply sharpening filter
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple sharpening kernel
        const sharpenKernel = [0, -0.25, 0, -0.25, 2, -0.25, 0, -0.25, 0];

        // Apply convolution (simplified)
        for (let i = 0; i < data.length; i += 4) {
          // Increase contrast slightly
          data[i] = Math.min(255, data[i] * 1.1); // Red
          data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green
          data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
        }

        ctx.putImageData(imageData, 0, 0);

        // Convert to data URL
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageSrc;
    });
  };

  useEffect(() => {
    if (enhance && src && isLoaded) {
      upscaleImage(src).then(setEnhancedSrc).catch(console.error);
    }
  }, [src, enhance, isLoaded, upscaleFactor]);

  const imageStyles: React.CSSProperties = {
    imageRendering: enhance ? "crisp-edges" : "auto",
    filter: enhance ? "contrast(1.15) brightness(1.03) saturate(1.08)" : "none",
    backfaceVisibility: "hidden",
    transform: "translateZ(0)",
    WebkitFontSmoothing: "antialiased",
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Không thể tải ảnh</span>
      </div>
    );
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <Image
        src={enhancedSrc || src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        unoptimized={enhance}
        className={cn(
          "transition-all duration-300",
          enhance && "pixel-perfect upscaled-image",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        style={imageStyles}
        onClick={onClick}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </>
  );
}

export default SuperEnhancedImage;
