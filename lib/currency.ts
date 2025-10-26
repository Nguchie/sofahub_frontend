export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
  // Use KSh instead of KES for consistent branding
  const formatted = new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice)
  return `KSh ${formatted}`
}

export function formatPhoneNumber(phone: string): string {
  // Format Kenyan phone numbers to +254 XXX XXX XXX
  const cleaned = phone.replace(/\D/g, "")

  if (cleaned.startsWith("254")) {
    const formatted = cleaned.replace(/^254(\d{3})(\d{3})(\d{3})$/, "+254 $1 $2 $3")
    return formatted
  }

  if (cleaned.startsWith("0")) {
    const withoutZero = cleaned.substring(1)
    const formatted = withoutZero.replace(/^(\d{3})(\d{3})(\d{3})$/, "+254 $1 $2 $3")
    return formatted
  }

  return phone
}
