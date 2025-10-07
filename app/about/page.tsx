import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Truck, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-balance">About Sofa Hub Kenya</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          We're Kenya's premier custom furniture destination, bringing quality, style, and comfort to homes across the country
          since 2017.
        </p>
      </section>

      {/* Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              At <strong>Sofa Hub Kenya</strong>, we believe your furniture should reflect your style, comfort, and lifestyle. 
              Founded 7 years ago in a small workshop along Manyanja Road, Nairobi, we set out with one simple goal—to make 
              high-quality, custom furniture affordable and accessible to everyone.
            </p>
            <p>
              From a one-person operation, we have grown into a dedicated team of 8 full-time professionals, with thriving 
              branches in <strong>Karen</strong> and <strong>Ongata Rongai, Kajiado County</strong>.
            </p>
            <p>
              We specialize in crafting <strong>bespoke furniture</strong> that combines style, durability, and affordability, including:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Sofas tailored to your taste</li>
              <li>Coffee tables</li>
              <li>Dining tables and chairs</li>
            </ul>
            <p>
              Beyond creating new pieces, we also offer <strong>furniture repair and restoration services</strong> for homes and 
              restaurants—bringing your beloved furniture back to life with a fresh new look.
            </p>
            <p>
              As part of our commitment to <strong>sustainable production, we actively care for the environment through 
              tree planting initiatives</strong>, ensuring that every creation contributes to a greener future.
            </p>
            <p>
              At Sofa Hub Kenya, every piece tells a story—<strong>your story, designed your way</strong>.
            </p>
          </div>
        </div>
        <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
          <img src="/images/hero-furniture.jpeg" alt="SofaHub showroom" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Values Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These core values guide everything we do, from selecting products to serving our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality First</h3>
              <p className="text-sm text-muted-foreground">
                We source only the finest materials and work with skilled craftsmen to ensure lasting quality.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Customer Care</h3>
              <p className="text-sm text-muted-foreground">
                Your satisfaction is our priority. We're here to help every step of the way.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Reliable Service</h3>
              <p className="text-sm text-muted-foreground">
                From order to delivery, we ensure a smooth and reliable experience.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community Focus</h3>
              <p className="text-sm text-muted-foreground">
                We're proud to be part of the Kenyan community and support local craftsmanship.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-lg text-muted-foreground">Numbers that tell our story</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">9345+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5,023+</div>
            <div className="text-sm text-muted-foreground">Products Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">47</div>
            <div className="text-sm text-muted-foreground">Counties Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">7</div>
            <div className="text-sm text-muted-foreground">Years of Excellence</div>
          </div>
        </div>
      </section>

      {/* Find Us Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Find Us</h2>
          <p className="text-lg text-muted-foreground">Visit our showroom to see our furniture collection in person</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Our Workshop Locations</h3>
                <div className="space-y-6">
                  <div>
                    <div className="font-medium text-primary">Main Workshop - Karen</div>
                    <div className="text-muted-foreground">Karen, Nairobi</div>
                    <div className="text-muted-foreground">Kenya</div>
                  </div>
                  <div>
                    <div className="font-medium text-primary">Branch Workshop</div>
                    <div className="text-muted-foreground">Ongata Rongai, Kajiado County</div>
                    <div className="text-muted-foreground">Kenya</div>
                  </div>
                  <div>
                    <div className="font-medium">Opening Hours</div>
                    <div className="text-muted-foreground">Monday - Saturday: 8:00 AM - 6:00 PM</div>
                    <div className="text-muted-foreground">Sunday: 10:00 AM - 4:00 PM</div>
                  </div>
                  <div>
                    <div className="font-medium">Contact</div>
                    <div className="text-muted-foreground">Phone: 0717 160 845</div>
                    <div className="text-muted-foreground">Phone: 0743 535 169</div>
                    <div className="text-muted-foreground">Email: sofahub68@gmail.com</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Map and Location Links */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8197896726!2d36.7465!3d-1.3684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1b3287489d8f%3A0x45bf5507cbb8f679!2sSofa%20Hub%20Kenya%2C%20Karen!5e0!3m2!1sen!2ske!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sofa Hub Kenya - Workshop Locations"
              />
            </div>
            
            {/* Individual Location Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-primary mb-2">Main Workshop - Karen</h4>
                <p className="text-sm text-muted-foreground mb-3">Karen, Nairobi</p>
                <a 
                  href="https://www.google.com/maps/place/Sofa+Hub+Kenya,Karen/@-1.3399359,36.7425089,17z/data=!3m1!4b1!4m6!3m5!1s0x182f1b3287489d8f:0x45bf5507cbb8f679!8m2!3d-1.3399359!4d36.7450892!16s%2Fg%2F11vr5vv8v4?hl=en&entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  📍 View on Google Maps
                </a>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Branch Workshop - Ongata Rongai</h4>
                <p className="text-sm text-muted-foreground mb-3">Ongata Rongai, Kajiado County</p>
                <a 
                  href="https://www.google.com/maps/search/Sofa+Fabrics/@-1.3969422,36.7505467,17z?hl=en&entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  📍 View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export const metadata = {
  title: "About Us - SofaHub",
  description: "Learn about SofaHub's story, values, and commitment to quality furniture in Kenya",
}
