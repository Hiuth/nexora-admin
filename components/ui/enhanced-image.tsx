"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EnhancedImageProps {
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
  enhance?: boolean; // Enable image enhancement for small images
}

export function EnhancedImage({
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
  ...props
}: EnhancedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Always enhance images for better quality, especially for small/thumbnail images
  const needsEnhancement = enhance;
  const shouldUnoptimize = Boolean(needsEnhancement);

  const imageStyles: React.CSSProperties = {
    imageRendering: needsEnhancement ? "crisp-edges" : "auto",
    // Additional CSS properties for better rendering
    ...(needsEnhancement && {
      filter: "contrast(1.1) brightness(1.02) saturate(1.05)",
      backfaceVisibility: "hidden",
      transform: "translateZ(0)", // Force hardware acceleration
      WebkitFontSmoothing: "antialiased",
    }),
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
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      quality={quality}
      priority={priority}
      unoptimized={shouldUnoptimize} // Use unoptimized for better quality on small images
      className={cn(
        "transition-all duration-300",
        needsEnhancement && "pixel-perfect",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      style={imageStyles}
      onClick={onClick}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}

export default EnhancedImage;
