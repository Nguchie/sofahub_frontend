import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  Phone, 
  Shield,
  Star,
  AlertCircle
} from "lucide-react"

export const metadata: Metadata = {
  title: "Delivery Information | Sofa Hub Kenya",
  description: "Comprehensive delivery information, policies, and timelines for Sofa Hub Kenya furniture delivery services.",
}

export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Delivery Information</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Everything you need to know about our delivery services, timelines, and policies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Delivery Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Standard Delivery Times</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-blue-600" />
                    <span><strong>Nairobi:</strong> 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-blue-600" />
                    <span><strong>Other locations:</strong> Up to 1 week maximum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 text-blue-600" />
                    <span><strong>Delivery times vary</strong> based on your specific location</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Custom Orders & Special Cases
                </h4>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li>• Some orders require custom manufacturing and may take longer</li>
                  <li>• We will <strong>contact you directly</strong> for such cases</li>
                  <li>• Custom orders may affect delivery dates - we'll keep you informed</li>
                  <li>• Our team will provide updated timelines for specialized items</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Fees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Delivery Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  FREE Delivery
                </h4>
                <p className="text-sm text-green-800">
                  <strong>Orders above KSh 50,000 within Nairobi qualify for FREE delivery!</strong>
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Paid Delivery</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Location-Based Pricing</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Delivery fees vary by location</li>
                      <li>• Distance from our workshops affects pricing</li>
                      <li>• Remote areas may have higher fees</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Product Size Impact</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Larger furniture requires special handling</li>
                      <li>• Size affects transportation costs</li>
                      <li>• Assembly complexity considered</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Maximum Delivery Fee</h4>
                <p className="text-sm text-blue-800">
                  <strong>Delivery fees will NOT exceed KSh 10,000</strong> regardless of location or product size.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Payment Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Important Payment Notes</h4>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li>• <strong>Delivery fees are NOT included</strong> in your online payment</li>
                  <li>• You pay <strong>50% deposit online</strong> for your furniture</li>
                  <li>• <strong>Remaining balance + delivery fee</strong> is paid upon delivery</li>
                  <li>• We accept cash, mobile money, and card payments on delivery</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Have questions about delivery? Our team is here to help!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Contact Us</h5>
                  <p className="text-sm text-muted-foreground">
                    Call or WhatsApp us for delivery inquiries and custom order updates.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Track Your Order</h5>
                  <p className="text-sm text-muted-foreground">
                    We'll keep you informed about your order status and delivery timeline.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Nairobi</Badge>
                <span className="text-sm">3-5 days</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Other Areas</Badge>
                <span className="text-sm">Up to 1 week</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Free Delivery
                </Badge>
                <span className="text-sm">KSh 50,000+ in Nairobi</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Max Fee
                </Badge>
                <span className="text-sm">KSh 10,000</span>
              </div>
            </CardContent>
          </Card>

          {/* Our Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Our Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border rounded-lg p-3">
                <h5 className="font-medium text-primary">Main Workshop - Karen</h5>
                <p className="text-sm text-muted-foreground">Karen, Nairobi</p>
              </div>
              <div className="border rounded-lg p-3">
                <h5 className="font-medium">Branch Workshop</h5>
                <p className="text-sm text-muted-foreground">Ongata Rongai, Kajiado County</p>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Our Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-sm">Furniture Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-sm">Assembly Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm">Furniture Repair</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm">Custom Furniture</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
