import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, MessageSquare, HelpCircle } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"

export default function ContactPage() {

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions about our furniture or need help with your order? We're here to help!
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Phone Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">0717 160 845</p>
                <p className="font-medium">0743 535 169</p>
                <p className="text-sm text-muted-foreground">Monday - Saturday: 8:00 AM - 6:00 PM</p>
                <p className="text-sm text-muted-foreground">Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">sofahub68@gmail.com</p>
                <p className="text-sm text-muted-foreground">General inquiries & orders</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Visit Our Showroom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-primary">Main Workshop - Karen</p>
                <p className="text-sm text-muted-foreground">Karen, Nairobi</p>
                <p className="text-sm text-muted-foreground">Kenya</p>
                <div className="pt-2">
                  <p className="font-medium text-primary">Branch Workshop</p>
                  <p className="text-sm text-muted-foreground">Ongata Rongai, Kajiado County</p>
                  <p className="text-sm text-muted-foreground">Kenya</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Response Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Phone calls:</span>
                  <span className="text-sm font-medium">Immediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Emails:</span>
                  <span className="text-sm font-medium">Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">WhatsApp:</span>
                  <span className="text-sm font-medium">Within 2 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>

      {/* FAQ Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8" />
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">Quick answers to common questions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">How long does delivery take?</h3>
              <p className="text-sm text-muted-foreground">
                Standard delivery takes 3-5 business days within Nairobi and 5-7 days for other counties. Express
                delivery is available for urgent orders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Do you offer assembly service?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer professional assembly service for all furniture items. This can be arranged during
                checkout or by contacting our support team.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept M-Pesa, Visa, Mastercard, and bank transfers. M-Pesa is our most popular and secure payment
                method.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Can I return or exchange items?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 30-day return policy for unused items in original packaging. Exchange is possible within
                14 days of delivery.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Do you have a warranty?</h3>
              <p className="text-sm text-muted-foreground">
                All our furniture comes with a 2-year warranty covering manufacturing defects and structural issues.
                Terms and conditions apply.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Can I track my order?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you'll receive SMS and email updates with tracking information once your order is dispatched. You
                can also call us for real-time updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export const metadata = {
  title: "Contact Us - SofaHub",
  description: "Get in touch with SofaHub for support, inquiries, or visit our showroom in Nairobi",
}
