"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProductVariation } from "@/lib/types"
import { formatPrice } from "@/lib/currency"

interface ProductVariationsProps {
  variations: ProductVariation[]
  selectedVariation: ProductVariation | null
  onVariationChange: (variation: ProductVariation) => void
}

export function ProductVariations({ variations, selectedVariation, onVariationChange }: ProductVariationsProps) {
  // Helper function to safely parse attributes
  const parseAttributes = (attributes: any) => {
    if (typeof attributes === 'string') {
      try {
        return JSON.parse(attributes)
      } catch {
        return {}
      }
    }
    return attributes || {}
  }

  // Group variations by attribute type
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
    {} as Record<string, Set<string>>,
  )

  const getVariationForAttributes = (targetAttributes: Record<string, string>) => {
    return variations.find((variation) => {
      const attrs = parseAttributes(variation.attributes)
      // Check if this variation matches the target attributes
      return Object.entries(targetAttributes).every(([key, value]) => {
        const attrValue = attrs[key]
        // Handle both string and parsed values
        if (typeof attrValue === 'string') {
          try {
            const parsed = JSON.parse(attrValue)
            return parsed === value
          } catch {
            return attrValue === value
          }
        }
        return attrValue === value
      })
    })
  }

  const handleAttributeChange = (attributeKey: string, attributeValue: string) => {
    const currentAttributes = parseAttributes(selectedVariation?.attributes) || {}
    const newAttributes = { ...currentAttributes, [attributeKey]: attributeValue }

    const newVariation = getVariationForAttributes(newAttributes)
    if (newVariation) {
      onVariationChange(newVariation)
    } else {
      // If no exact match, try to find a variation with just the selected attribute
      const fallbackVariation = variations.find((variation) => {
        const attrs = parseAttributes(variation.attributes)
        const attrValue = attrs[attributeKey]
        if (typeof attrValue === 'string') {
          try {
            const parsed = JSON.parse(attrValue)
            return parsed === attributeValue
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
  }

  // Format attribute display names
  const formatAttributeName = (key: string) => {
    const nameMap: Record<string, string> = {
      'color': 'Color',
      'material': 'Material',
      'size': 'Size',
      'sku': 'SKU',
      'finish': 'Finish',
      'style': 'Style',
      'dimensions': 'Dimensions'
    }
    return nameMap[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  // Format attribute values
  const formatAttributeValue = (key: string, value: string) => {
    if (key.toLowerCase() === 'sku') return value
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Options</h3>

      {Object.entries(attributeGroups).map(([attributeKey, values]) => {
        // Skip SKU and modifier from display as they're not user-selectable options
        if (attributeKey.toLowerCase() === 'sku' || attributeKey.toLowerCase() === 'modifier') return null
        
        return (
          <div key={attributeKey} className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {formatAttributeName(attributeKey)}
            </h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(values).map((value) => {
                const currentAttrs = parseAttributes(selectedVariation?.attributes)
                const isSelected = currentAttrs[attributeKey] === value
                
                // Check if there's any variation with this attribute value
                const variation = variations.find((v) => {
                  const attrs = parseAttributes(v.attributes)
                  const attrValue = attrs[attributeKey]
                  if (typeof attrValue === 'string') {
                    try {
                      const parsed = JSON.parse(attrValue)
                      return parsed === value
                    } catch {
                      return attrValue === value
                    }
                  }
                  return attrValue === value
                })
                
              const isAvailable = variation && variation.stock_quantity > 0

              return (
                <Button
                  key={value}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                    className={`h-8 px-3 text-xs ${
                      isSelected 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-primary/10"
                    } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => isAvailable && handleAttributeChange(attributeKey, value)}
                  disabled={!isAvailable}
                >
                    {formatAttributeValue(attributeKey, value)}
                  {variation && variation.price !== selectedVariation?.price && (
                      <Badge variant="secondary" className="ml-1 text-xs px-1 py-0">
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

      {/* Selected variation summary */}
      {selectedVariation && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md border">
          <div className="flex items-center justify-between text-sm">
            <div>
                     <span className="text-muted-foreground">
                       {Object.entries(parseAttributes(selectedVariation.attributes))
                         .filter(([key]) => key.toLowerCase() !== 'sku' && key.toLowerCase() !== 'modifier')
                         .map(([key, value]) => `${formatAttributeName(key)}: ${formatAttributeValue(key, String(value))}`)
                         .join(" • ")}
                     </span>
              <div className="text-xs text-muted-foreground font-mono mt-1">
                SKU: {selectedVariation.sku}
              </div>
            </div>
            <div className="text-right">
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
