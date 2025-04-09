"use client";

import { useState, useEffect } from "react";
import { cn, checkImageExists } from "@/lib/utils";

interface StylePreviewProps {
  name: string;
  imageUrl?: string;
  className?: string;
}

export default function StylePreview({ name, imageUrl, className }: StylePreviewProps) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageExists, setImageExists] = useState(false);

  useEffect(() => {
    async function verifyImage() {
      if (imageUrl) {
        const exists = await checkImageExists(imageUrl);
        setImageExists(exists);
        setIsLoading(false);
      } else {
        setImageExists(false);
        setIsLoading(false);
      }
    }

    verifyImage();
  }, [imageUrl]);

  // If no image URL or error loading image, show a placeholder
  if (!imageUrl || isError || !imageExists) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-100 rounded-md w-full h-[180px]",
        className
      )}>
        <div className="text-center text-gray-500 p-2">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs">预览不可用</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative w-full h-[180px] rounded-md overflow-hidden bg-gray-50",
      isLoading ? "animate-pulse" : "",
      className
    )}>
      <div className="relative w-full h-full flex items-center justify-center p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`${name}预览图`}
          className="object-contain max-w-full max-h-full shadow-sm"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsError(true)}
        />
      </div>
    </div>
  );
}
