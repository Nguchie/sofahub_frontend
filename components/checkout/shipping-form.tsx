"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CheckoutData } from "@/lib/types"

interface ShippingFormProps {
  initialData?: CheckoutData["shipping_address"]
  onSubmit: (data: CheckoutData["shipping_address"]) => void
  onBack: () => void
}

const kenyanCounties = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Malindi",
  "Kitale",
  "Garissa",
  "Kakamega",
  "Machakos",
  "Meru",
  "Nyeri",
  "Kericho",
  "Embu",
  "Migori",
  "Homa Bay",
  "Naivasha",
  "Kitui",
  "Kapenguria",
  "Moyale",
  "Chuka",
  "Kiambu",
  "Kajiado",
]

export function ShippingForm({ initialData, onSubmit, onBack }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    street: initialData?.street || "",
    city: initialData?.city || "",
    county: initialData?.county || "",
    postal_code: initialData?.postal_code || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.county.trim()) {
      newErrors.county = "County is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="street">Street Address *</Label>
          <Input
            id="street"
            value={formData.street}
            onChange={(e) => handleChange("street", e.target.value)}
            placeholder="Enter your street address"
            className={errors.street ? "border-destructive" : ""}
          />
          {errors.street && <p className="text-sm text-destructive mt-1">{errors.street}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Enter your city"
              className={errors.city ? "border-destructive" : ""}
            />
            {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
          </div>

          <div>
            <Label htmlFor="county">County *</Label>
            <Select value={formData.county} onValueChange={(value) => handleChange("county", value)}>
              <SelectTrigger className={errors.county ? "border-destructive" : ""}>
                <SelectValue placeholder="Select county" />
              </SelectTrigger>
              <SelectContent>
                {kenyanCounties.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.county && <p className="text-sm text-destructive mt-1">{errors.county}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="postal_code">Postal Code (Optional)</Label>
          <Input
            id="postal_code"
            value={formData.postal_code}
            onChange={(e) => handleChange("postal_code", e.target.value)}
            placeholder="Enter postal code"
          />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-900 mb-2">Delivery Information</h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• <span className="font-medium text-green-600">FREE delivery</span> within Nairobi for orders above KSh 50,000</li>
          <li>• Other locations: KSh 0 - 10,000 (charged upon delivery)</li>
          <li>• Delivery fee depends on location and product size</li>
          <li>• Standard delivery: 3-5 business days</li>
          <li>• Assembly service available upon request</li>
        </ul>
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          <strong>Note:</strong> Delivery fees are handled separately in person and are not included in your online payment.
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </form>
  )
}
