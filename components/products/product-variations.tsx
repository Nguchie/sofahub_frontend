"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/currency"
import type { ProductVariation } from "@/lib/types"

interface ProductVariationsProps {
  variations: ProductVariation[]
  selectedVariation: ProductVariation | null
  onVariationChange: (variation: ProductVariation) => void
}

export function ProductVariations({
  variations,
  selectedVariation,
  onVariationChange,
}: ProductVariationsProps) {
  const parseAttributes = (attributes: unknown) => {
    if (typeof attributes === "string") {
      try {
        return JSON.parse(attributes) as Record<string, unknown>
      } catch {
        return {}
      }
    }

    return (attributes as Record<string, unknown>) || {}
  }

  const attributeGroups = variations.reduce(
    (groups, variation) => {
      const attrs = parseAttributes(variation.attributes)
      Object.entries(attrs).forEach(([key, value]) => {
        if (!groups[key]) {
          groups[key] = new Set()
        }
        groups[key].add(String(value))
      })
      return groups
    },
    {} as Record<string, Set<string>>
  )

  const getVariationForAttributes = (targetAttributes: Record<string, string>) => {
    return variations.find((variation) => {
      const attrs = parseAttributes(variation.attributes)

      return Object.entries(targetAttributes).every(([key, value]) => {
        const attrValue = attrs[key]
        if (typeof attrValue === "string") {
          try {
            return JSON.parse(attrValue) === value
          } catch {
            return attrValue === value
          }
        }
        return attrValue === value
      })
    })
  }

  const handleAttributeChange = (attributeKey: string, attributeValue: string) => {
    const currentAttributes = parseAttributes(selectedVariation?.attributes)
    const newAttributes = { ...currentAttributes, [attributeKey]: attributeValue }

    const newVariation = getVariationForAttributes(newAttributes as Record<string, string>)
    if (newVariation) {
      onVariationChange(newVariation)
      return
    }

    const fallbackVariation = variations.find((variation) => {
      const attrs = parseAttributes(variation.attributes)
      const attrValue = attrs[attributeKey]
      if (typeof attrValue === "string") {
        try {
          return JSON.parse(attrValue) === attributeValue
        } catch {
          return attrValue === attributeValue
        }
      }
      return attrValue === attributeValue
    })

    if (fallbackVariation) {
      onVariationChange(fallbackVariation)
    }
  }

  const formatAttributeName = (key: string) => {
    const nameMap: Record<string, string> = {
      color: "Color",
      material: "Material",
      size: "Size",
      sku: "SKU",
      finish: "Finish",
      style: "Style",
      dimensions: "Dimensions",
    }

    return nameMap[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  const formatAttributeValue = (key: string, value: string) => {
    if (key.toLowerCase() === "sku") {
      return value
    }

    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Options</h3>

      {Object.entries(attributeGroups).map(([attributeKey, values]) => {
        if (attributeKey.toLowerCase() === "sku" || attributeKey.toLowerCase() === "modifier") {
          return null
        }

        return (
          <div key={attributeKey} className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {formatAttributeName(attributeKey)}
            </h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(values).map((value) => {
                const currentAttrs = parseAttributes(selectedVariation?.attributes)
                const isSelected = currentAttrs[attributeKey] === value

                const variation = variations.find((item) => {
                  const attrs = parseAttributes(item.attributes)
                  const attrValue = attrs[attributeKey]
                  if (typeof attrValue === "string") {
                    try {
                      return JSON.parse(attrValue) === value
                    } catch {
                      return attrValue === value
                    }
                  }
                  return attrValue === value
                })

                const isAvailable = Boolean(variation && variation.stock_quantity > 0)

                return (
                  <Button
                    key={value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`h-auto max-w-full px-3 py-2 text-left text-xs leading-snug whitespace-normal ${
                      isSelected ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                    } ${!isAvailable ? "cursor-not-allowed opacity-50" : ""}`}
                    onClick={() => isAvailable && handleAttributeChange(attributeKey, value)}
                    disabled={!isAvailable}
                  >
                    {formatAttributeValue(attributeKey, value)}
                    {variation && variation.price !== selectedVariation?.price && (
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
                        {formatPrice(variation.price)}
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>
        )
      })}

      {selectedVariation && (
        <div className="mt-4 rounded-md border bg-muted/50 p-3">
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-muted-foreground">
                {Object.entries(parseAttributes(selectedVariation.attributes))
                  .filter(([key]) => key.toLowerCase() !== "sku" && key.toLowerCase() !== "modifier")
                  .map(
                    ([key, value]) =>
                      `${formatAttributeName(key)}: ${formatAttributeValue(key, String(value))}`
                  )
                  .join(" / ")}
              </span>
              <div className="mt-1 font-mono text-xs text-muted-foreground">
                SKU: {selectedVariation.sku}
              </div>
            </div>
            <div className="sm:text-right">
              <div className="font-medium text-primary">{formatPrice(selectedVariation.price)}</div>
              <div className="text-xs text-muted-foreground">
                {selectedVariation.stock_quantity} available
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
