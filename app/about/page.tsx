import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { Card } from '@/components/ui/card'
import { GovernmentRecognitions } from '@/components/government-recognitions'
import {
  aboutParagraphs,
  achievements,
  contactDetails,
  coreValues,
  mainQuote,
  missionAreas,
} from '@/lib/site-content'
import {
  BookOpen,
  GraduationCap,
  HandHeart,
  Heart,
  HeartPulse,
  Leaf,
  MapPin,
  PawPrint,
} from 'lucide-react'

const valueIcons = [HandHeart, BookOpen, Heart]
const missionIcons = [HeartPulse, Leaf, HandHeart, PawPrint, GraduationCap]

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <PageHero
          title="About Us"
          subtitle="Serving communities with compassion and purpose."
          backgroundImage="/Activity-camp.jpeg"
        />

        <section className="w-full py-12 md:py-16 bg-card">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="max-w-4xl mx-auto space-y-6 text-center">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
              <p className="text-xl font-semibold text-primary leading-relaxed">
                {mainQuote}
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coreValues.map((value, index) => {
                const Icon = valueIcons[index]
                return (
                  <Card key={value.title} className="p-7 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-5">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-primary mb-1">{value.title}</p>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {value.subtitle}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-card">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {missionAreas.map((area, index) => {
                const Icon = missionIcons[index]
                return (
                  <Card key={area.title} className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-primary mb-2">
                      {index + 1}. {area.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {area.description}
                    </p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Achievements
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.label} className="p-7 text-center">
                  <p className="text-4xl font-bold text-primary mb-3">
                    {achievement.value}
                    {achievement.suffix}
                  </p>
                  <p className="text-muted-foreground">{achievement.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <GovernmentRecognitions className="bg-card" />

        <section className="w-full py-12 md:py-16 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-8">
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
                      {contactDetails.registeredAddress}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Registration No.: {contactDetails.registrationNo}
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
