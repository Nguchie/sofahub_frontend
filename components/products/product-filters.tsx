"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { tagApi, productTypeApi } from "@/lib/api"

const priceRanges = [
  { label: "Under KSh 10,000", min: 0, max: 10000 },
  { label: "KSh 10,000 - 25,000", min: 10000, max: 25000 },
  { label: "KSh 25,000 - 50,000", min: 25000, max: 50000 },
  { label: "KSh 50,000 - 100,000", min: 50000, max: 100000 },
  { label: "Over KSh 100,000", min: 100000, max: Number.POSITIVE_INFINITY },
]

interface ProductFiltersProps {
  category?: string
  selectedTags: string[]
  selectedProductType: string | null
  selectedPriceRange?: { min: number; max: number }
  onTagsChange: (tags: string[]) => void
  onProductTypeChange: (type: string | null) => void
  onPriceRangeChange: (range: { min: number; max: number } | null) => void
}

export function ProductFilters({ 
  category, 
  selectedTags, 
  selectedProductType,
  selectedPriceRange,
  onTagsChange, 
  onProductTypeChange,
  onPriceRangeChange 
}: ProductFiltersProps) {
  const [availableTags, setAvailableTags] = useState<any[]>([])
  const [availableProductTypes, setAvailableProductTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [tagsData, typesData] = await Promise.all([
          tagApi.getAll(),
          productTypeApi.getAll()
        ])
        setAvailableTags(tagsData)
        setAvailableProductTypes(typesData)
      } catch (error) {
        console.error("Failed to fetch filter data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFilterData()
  }, [])

  const handleTagToggle = (tagSlug: string) => {
    const newTags = selectedTags.includes(tagSlug)
      ? selectedTags.filter((tag) => tag !== tagSlug)
      : [...selectedTags, tagSlug]
    onTagsChange(newTags)
  }

  const handleProductTypeChange = (typeSlug: string) => {
    // If the same type is selected, deselect it (set to null)
    const newType = selectedProductType === typeSlug ? null : typeSlug
    onProductTypeChange(newType)
  }

  const handlePriceRangeToggle = (range: { min: number; max: number }) => {
    if (selectedPriceRange && selectedPriceRange.min === range.min && selectedPriceRange.max === range.max) {
      onPriceRangeChange(null)
    } else {
      onPriceRangeChange(range)
    }
  }

  const clearAllFilters = () => {
    onTagsChange([])
    onProductTypeChange(null)
    onPriceRangeChange(null)
  }

  const hasActiveFilters = selectedTags.length > 0 || selectedProductType || selectedPriceRange

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tagSlug) => {
                const tag = availableTags.find((t) => t.slug === tagSlug)
                if (!tag) return null
                return (
                  <Badge
                    key={tag.slug}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag.slug)}
                  >
                    {tag.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )
              })}
              {selectedProductType && (() => {
                const type = availableProductTypes.find((t) => t.slug === selectedProductType)
                if (!type) return null
                return (
                  <Badge
                    key={type.slug}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleProductTypeChange(type.slug)}
                  >
                    {type.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filter by Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableTags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.slug)}
                  onCheckedChange={() => handleTagToggle(tag.slug)}
                    className="border-2 border-primary/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <label
                  htmlFor={`tag-${tag.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 flex-1"
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color_code }} />
                  {tag.name}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Types Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Product Type</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <RadioGroup value={selectedProductType || ""} onValueChange={handleProductTypeChange}>
              <div className="space-y-3">
                {availableProductTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={type.slug}
                      id={`type-${type.id}`}
                      className="border-2 border-primary/20 data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor={`type-${type.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {priceRanges.map((range, index) => (
                <div key={index} className="flex items-center space-x-3">
                <Checkbox
                  id={`price-${index}`}
                    checked={selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max}
                    onCheckedChange={() => handlePriceRangeToggle(range)}
                    className="border-2 border-primary/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <label
                  htmlFor={`price-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
