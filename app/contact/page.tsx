import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { Card } from '@/components/ui/card'
import { MapPin, Phone, Mail, BadgeCheck, QrCode } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { contactDetails } from '@/lib/site-content'

export const metadata = {
  title: 'Contact Us | Sansar Kalyan Trust',
  description: 'Get in touch with Sansar Kalyan Trust.',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="Contact Us"
          subtitle="We would love to hear from you."
          backgroundImage="/Help_activity.jpeg"
        />

        <section className="w-full py-20 md:py-28 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <Card className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Get in Touch</h3>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Registered Address:</p>
                        <p className="text-muted-foreground">
                          {contactDetails.registeredAddress}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <BadgeCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Registration No.:</p>
                        <p className="text-muted-foreground">
                          {contactDetails.registrationNo}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Phone / WhatsApp:</p>
                        <a href={`tel:${contactDetails.phoneHref}`} className="text-primary hover:underline">
                          {contactDetails.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Email:</p>
                        <a href={`mailto:${contactDetails.email}`} className="text-primary hover:underline">
                          {contactDetails.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <QrCode className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">UPI (BHIM):</p>
                        <p className="text-muted-foreground">{contactDetails.upi}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {contactDetails.qrNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

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
