import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { Card } from '@/components/ui/card'
import { Heart, BookOpen, Sprout, Shield, Leaf, Users, Target, Award, MapPin, Calendar } from 'lucide-react'

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="About Us"
          subtitle="Serving communities with compassion and purpose."
        />

        {/* Mission & Vision */}
        <section className="w-full py-20 md:py-32 bg-card">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Dedicated to uplifting communities through education, health camps, environmental initiatives, and sustainable livelihoods. We believe in empowering individuals to lead healthier, more productive, and dignified lives.
                </p>
                <p className="text-lg font-italic text-primary">
                  <em>Har Daan Ek Pehchaan</em>
                </p>
              </div>

              {/* Vision */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-primary">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  A society where everyone has access to quality education, healthcare, and a clean environment. We envision communities empowered by knowledge, healthy in body and mind, and united in solidarity across Haryana and India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Compassion', desc: 'Empathy and genuine care for all communities we serve', icon: Heart },
                { title: 'Education', desc: 'Foundation of lasting change and personal development', icon: BookOpen },
                { title: 'Sustainability', desc: 'Long-term impact, not quick fixes or temporary solutions', icon: Sprout },
                { title: 'Transparency', desc: 'Every donation accounted for with complete accountability', icon: Shield },
                { title: 'Community', desc: 'Local communities lead their own transformation', icon: Users },
                { title: 'Impact', desc: 'Measurable improvements in lives and livelihoods', icon: Leaf },
              ].map((value, i) => {
                const Icon = value.icon
                return (
                  <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.desc}
                    </p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="w-full py-20 md:py-32 bg-card">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Founder & Chairman
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="/founder_SankarRana.jpeg"
                  alt="Dr. Shekhar Rana, Founder & Chairman"
                  className="rounded-lg shadow-lg object-cover w-full h-96"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-foreground">
                    Dr. Shekhar Rana
                  </h3>
                  <p className="text-lg text-primary font-semibold">Founder & Chairman</p>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Dr. Shekhar Rana has organized 50+ health camps across Rohtak and neighboring districts, impacting thousands of families. His vision extends to tree plantation drives, free night street education programs, and cloth distribution initiatives that have touched countless lives.
                </p>
                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded">
                  <p className="text-lg font-italic text-primary">
                    <em>&quot;Sewa hi sabse bada dharm hai.&quot;</em>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Service is the greatest virtue.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Journey
              </h2>
            </div>

            <div className="space-y-8 max-w-3xl mx-auto">
              {[
                { year: '2019', title: 'Foundation', desc: 'Sansar Kalyan Trust founded in Rohtak by Dr. Shekhar Rana with a vision to serve communities.' },
                { year: '2020', title: 'First Health Camp', desc: 'Organized first health camp serving 500+ families during challenging times.' },
                { year: '2021', title: 'Free Night Education', desc: 'Launched free night street education program to support underprivileged children.' },
                { year: '2022', title: 'Environment & Animal Care', desc: 'Planted 5,000+ trees and initiated street animal rescue programs across districts.' },
                { year: '2023', title: 'Expanded Reach', desc: 'Expanded operations to 10+ villages with cloth and food distribution drives.' },
                { year: '2024', title: 'Community Impact', desc: 'Engaging 1,000+ volunteers and running multiple impactful campaigns.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-primary rounded-full mt-2" />
                    {i < 5 && <div className="w-1 h-24 bg-primary/20 mt-4" />}
                  </div>
                  <Card className="p-6 flex-1 hover:shadow-lg transition-shadow">
                    <p className="text-lg font-bold text-primary">{item.year}</p>
                    <h4 className="text-xl font-bold text-foreground mt-1">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground mt-2">
                      {item.desc}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where We Work */}
        <section className="w-full py-20 md:py-32 bg-card">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Where We Work
              </h2>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="p-8 border-l-4 border-primary">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Sansar Kalyan Trust
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      House No 1239, First Floor<br />
                      Sector 3, Rohtak<br />
                      Haryana 124001, India
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
