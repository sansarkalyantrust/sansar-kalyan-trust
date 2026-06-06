import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, Shield, Zap } from 'lucide-react'

export default function Donate() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="Donate"
          subtitle="Your generosity transforms lives."
        />

        {/* 80G Tax Exemption Banner */}
        <section className="w-full py-12 md:py-16 bg-primary/5 border-b border-primary/10">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg border-2 border-primary">
              <Shield className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-foreground">80G Tax Exemption</h3>
                <p className="text-sm text-muted-foreground">
                  Donations eligible under Section 80G of the Income Tax Act. Receive receipt for tax deduction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Options */}
        <section className="w-full py-20 md:py-32 bg-card">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choose Your Contribution
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every amount makes an impact. Choose one-time or recurring donations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { amount: '₹500', desc: 'Supports one health checkup', icon: '🏥' },
                { amount: '₹1,000', desc: 'Provides educational materials', icon: '📚' },
                { amount: '₹5,000', desc: 'Funds a community workshop', icon: '🌱' },
              ].map((option, i) => (
                <Card key={i} className="p-8 hover:shadow-lg transition-shadow border-accent/20 text-center">
                  <div className="text-4xl mb-4">{option.icon}</div>
                  <p className="text-3xl font-bold text-accent mb-2">
                    {option.amount}
                  </p>
                  <p className="text-muted-foreground mb-6">
                    {option.desc}
                  </p>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Donate Now
                  </Button>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Want to donate a custom amount?
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 h-auto">
                Custom Donation
              </Button>
            </div>
          </div>
        </section>

        {/* Why Donate */}
        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Your Donation Matters
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Direct Impact
                </h3>
                <p className="text-muted-foreground">
                  100% of your donation goes directly to our beneficiaries and programs.
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Transparent & Safe
                </h3>
                <p className="text-muted-foreground">
                  We are a registered NGO with complete transparency in fund utilization.
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Tax Benefits
                </h3>
                <p className="text-muted-foreground">
                  Your donation is tax-deductible under section 80G of the Income Tax Act.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How Your Money Helps */}
        <section className="w-full py-20 md:py-32 bg-card">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How Your Money Helps
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  amount: '₹100',
                  impact: 'Provides essential medicines to one beneficiary',
                },
                {
                  amount: '₹500',
                  impact: 'Conducts free health checkup and screening for 5 people',
                },
                {
                  amount: '₹1,000',
                  impact: 'Funds educational materials for 10 students for a month',
                },
                {
                  amount: '₹5,000',
                  impact: 'Organizes a complete health camp covering 50+ people',
                },
                {
                  amount: '₹10,000',
                  impact: 'Provides scholarship support for one student for a year',
                },
              ].map((item, i) => (
                <Card key={i} className="p-6 flex items-center gap-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-accent min-w-fit">
                    {item.amount}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">
                      {item.impact}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Methods */}
        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ways to Donate
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the payment method that works best for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Online Payment
                </h3>
                <p className="text-muted-foreground mb-6">
                  Donate securely using Razorpay, UPI, credit card, or net banking.
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Donate Online
                </Button>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  UPI Transfer
                </h3>
                <p className="text-muted-foreground mb-6">
                  Scan the QR code or send money directly via UPI.
                </p>
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="UPI QR Code"
                    className="w-40 h-40 mx-auto"
                  />
                </div>
              </Card>
            </div>

            <Card className="p-8 mt-8 bg-card border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Bank Transfer
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p><span className="font-semibold">Account Name:</span> Sansar Kalyan Trust</p>
                <p><span className="font-semibold">Account Number:</span> XXXXXXXXXX</p>
                <p><span className="font-semibold">IFSC Code:</span> XXXXXXXX</p>
                <p><span className="font-semibold">Bank:</span> [Bank Name]</p>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-20 md:py-32 bg-card">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  q: 'Is my donation tax-deductible?',
                  a: 'Yes! Sansar Kalyan Trust is registered under 80G. You will receive a donation receipt for tax purposes.',
                },
                {
                  q: 'Can I donate anonymously?',
                  a: 'Yes, you can choose to remain anonymous while donating online.',
                },
                {
                  q: 'How can I track my donation impact?',
                  a: 'We provide detailed impact reports to our donors showing how funds are utilized.',
                },
                {
                  q: 'Can I set up a recurring donation?',
                  a: 'Yes, you can set up monthly or yearly recurring donations for sustained impact.',
                },
              ].map((faq, i) => (
                <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                  <h4 className="font-bold text-foreground mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
