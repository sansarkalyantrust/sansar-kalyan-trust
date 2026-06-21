import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { contactDetails, joinOptions, keyPrograms } from '@/lib/site-content'
import { BookOpen, Heart, Mail, MapPin, Package, Phone, Sprout } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Donate() {
  const donateGoods = joinOptions.find((option) => option.title === 'Donate Goods')
  const donateMoney = joinOptions.find((option) => option.title === 'Donate Money')

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="Donate"
          subtitle="Your generosity transforms lives."
          backgroundImage="/donation_scanner.jpeg"
        />

        <section className="w-full py-20 md:py-28 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-8 space-y-5">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Donate Goods</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {donateGoods?.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Accepts clothes (kids/adults), books, stationery, toys,
                  blankets and other useful items.
                </p>
                <Link href="/contact">
                  <Button className="gap-2">
                    <Heart className="h-4 w-4" />
                    Contact to Donate Goods
                  </Button>
                </Link>
              </Card>

              <Card className="p-8 space-y-5">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Donate Money</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {donateMoney?.description}
                </p>
                <div className="rounded-lg bg-muted p-5">
                  <p className="font-semibold text-foreground">UPI (BHIM):</p>
                  <p className="text-primary text-lg">{contactDetails.upi}</p>
                </div>
                <Image
                  src="/donation_scanner.jpeg"
                  alt="Sansar Kalyan Trust UPI QR code"
                  width={240}
                  height={240}
                  className="rounded-lg border bg-white"
                />
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-28 bg-card">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Your Support Reaches These Programs
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {keyPrograms.map((program, index) => {
                const Icon = [Sprout, BookOpen, Heart][index]
                return (
                  <Card key={program.title} className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {program.title}
                    </h3>
                    <p className="text-primary font-semibold mb-4">{program.quote}</p>
                    <ul className="space-y-2">
                      {program.points.map((point) => (
                        <li key={point} className="text-sm text-muted-foreground flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-28 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Contact & Donate
              </h2>
            </div>

            <Card className="p-8 max-w-3xl mx-auto space-y-5">
              <div className="flex gap-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Registered Address:</p>
                  <p className="text-muted-foreground">{contactDetails.registeredAddress}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Phone / WhatsApp:</p>
                  <a href={`tel:${contactDetails.phoneHref}`} className="text-primary hover:underline">
                    {contactDetails.phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Email:</p>
                  <a href={`mailto:${contactDetails.email}`} className="text-primary hover:underline">
                    {contactDetails.email}
                  </a>
                </div>
              </div>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Registration No.:</span>{' '}
                {contactDetails.registrationNo}
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">UPI (BHIM):</span>{' '}
                {contactDetails.upi}
              </p>
              <p className="text-sm text-muted-foreground">{contactDetails.qrNote}</p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
