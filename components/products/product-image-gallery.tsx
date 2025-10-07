"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import type { ProductImage } from "@/lib/types"

interface ProductImageGalleryProps {
  images: (ProductImage | { image: string; alt_text: string })[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Ensure we have valid images array
  const validImages = images && images.length > 0 ? images : [{ image: "/placeholder.svg", alt_text: productName }]
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  const currentImage = validImages[currentImageIndex] || validImages[0]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
        <img
          src={currentImage?.image || "/placeholder.svg"}
          alt={currentImage?.alt_text || productName}
          className="w-full h-full object-cover"
        />

        {/* Navigation arrows */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Expand button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="relative aspect-square">
              <img
                src={currentImage?.image || "/placeholder.svg"}
                alt={currentImage?.alt_text || productName}
                className="w-full h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Image counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {currentImageIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              className={`aspect-square bg-muted rounded-md overflow-hidden border-2 transition-colors ${
                index === currentImageIndex ? "border-primary" : "border-transparent hover:border-border"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={image?.image || "/placeholder.svg"}
                alt={image?.alt_text || `${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
