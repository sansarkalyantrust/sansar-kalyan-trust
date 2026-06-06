import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { Card } from '@/components/ui/card'
import { MapPin, Phone, Mail, Instagram, Youtube, Clock } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import Link from 'next/link'

export const metadata = {
  title: 'Contact Us | Sansar Kalyan Trust',
  description: 'Get in touch with Sansar Kalyan Trust. We would love to hear from you.',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="Contact Us"
          subtitle="We would love to hear from you."
        />

        {/* Two Column Layout */}
        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column - Contact Info */}
              <div className="space-y-6">
                {/* Get in Touch Card */}
                <Card className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Get in Touch</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Address</p>
                        <p className="text-muted-foreground">
                          House No 1239, First Floor<br />
                          Sector 3, Rohtak<br />
                          Haryana 124001, India
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Phone</p>
                        <a href="tel:+919991647126" className="text-primary hover:underline">
                          +91 9991647126
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Email</p>
                        <a href="mailto:sansarkalyantrust@gmail.com" className="text-primary hover:underline">
                          sansarkalyantrust@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Hours</p>
                        <p className="text-muted-foreground">
                          Mon – Sat: 10:00 AM – 6:00 PM
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold text-foreground mb-4">Follow Us</p>
                    <div className="flex gap-4">
                      <a
                        href="https://instagram.com/sansar_kalyan_trust"
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Instagram className="w-5 h-5 text-primary" />
                      </a>
                      <a
                        href="https://youtube.com/@sansarkalyantrust"
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Youtube className="w-5 h-5 text-primary" />
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Google Maps */}
                <Card className="p-6 overflow-hidden h-80 flex items-center justify-center bg-muted rounded-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3424.5873457894946!2d76.99999!3d29.2083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391227e62e62e62f%3A0x123456!2sSansar%20Kalyan%20Trust!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </Card>
              </div>

              {/* Right Column - Message Form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
