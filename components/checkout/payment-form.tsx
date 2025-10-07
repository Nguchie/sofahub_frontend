"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface PaymentFormProps {
  initialData?: { mpesa_phone: string }
  onSubmit: (data: { mpesa_phone: string }) => void
  onBack: () => void
}

export function PaymentForm({ initialData, onSubmit, onBack }: PaymentFormProps) {
  const [mpesaPhone, setMpesaPhone] = useState(initialData?.mpesa_phone || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!mpesaPhone.trim()) {
      newErrors.mpesa_phone = "M-Pesa phone number is required"
    } else if (!/^(\+254|0)[17]\d{8}$/.test(mpesaPhone.replace(/\s/g, ""))) {
      newErrors.mpesa_phone = "Please enter a valid Kenyan phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({ mpesa_phone: mpesaPhone })
    }
  }

  const handlePhoneChange = (value: string) => {
    setMpesaPhone(value)
    if (errors.mpesa_phone) {
      setErrors((prev) => ({ ...prev, mpesa_phone: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <Label className="text-base font-medium">Payment Method</Label>
        <div className="mt-3">
          <Card className="border-2 border-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 text-white px-3 py-2 rounded font-bold text-sm">M-PESA</div>
                <div>
                  <div className="font-medium">M-Pesa Payment</div>
                  <div className="text-sm text-muted-foreground">Secure payment via M-Pesa mobile money</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* M-Pesa Phone Number */}
      <div>
        <Label htmlFor="mpesa_phone">M-Pesa Phone Number *</Label>
        <Input
          id="mpesa_phone"
          value={mpesaPhone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="+254 700 123 456"
          className={errors.mpesa_phone ? "border-destructive" : ""}
        />
        {errors.mpesa_phone && <p className="text-sm text-destructive mt-1">{errors.mpesa_phone}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          You'll receive an M-Pesa prompt on this number to complete payment
        </p>
      </div>

      {/* Payment Process Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Downpayment Process</h4>
        <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
          <li>Click "Continue to Review" to proceed</li>
          <li>Review your order details</li>
          <li>Click "Place Order" to initiate deposit payment</li>
          <li>You'll receive an M-Pesa prompt for 50% deposit</li>
          <li>Enter your M-Pesa PIN to complete deposit payment</li>
          <li>Remaining 50% will be paid upon delivery</li>
          <li>You'll receive order confirmation via WhatsApp</li>
        </ol>
      </div>

      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Secure Payment</h4>
        <p className="text-sm text-blue-800">
          Your payment is processed securely through Safaricom M-Pesa. We never store your M-Pesa PIN or personal
          payment information.
        </p>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue to Review
        </Button>
      </div>
    </form>
  )
}
