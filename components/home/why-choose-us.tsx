import { Truck, Shield, CreditCard, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free delivery within Nairobi for orders above KSh 50,000",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "2-year warranty on all furniture with quality craftsmanship",
  },
  {
    icon: CreditCard,
    title: "M-Pesa Payments",
    description: "Secure and convenient payments via M-Pesa and other methods",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer support to help with your furniture needs",
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SofaHub?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best furniture shopping experience in Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
