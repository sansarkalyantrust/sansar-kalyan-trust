'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GovernmentRecognitions } from '@/components/government-recognitions'
import { RotatingTagline } from '@/components/rotating-tagline'
import {
  aboutParagraphs,
  achievements,
  contactDetails,
  coreValues,
  glimpses,
  joinOptions,
  keyPrograms,
  mainQuote,
  missionAreas,
  moreFromGround,
  organizationName,
} from '@/lib/site-content'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HandHeart,
  Heart,
  HeartPulse,
  IndianRupee,
  Leaf,
  Mail,
  MapPin,
  Package,
  PawPrint,
  Phone,
  Quote,
  Recycle,
  Share2,
  Sprout,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const heroImages = [
  '/Activity-camp.jpeg',
  '/Help_activity.jpeg',
  '/medicine_camp.jpeg',
  '/Activity-group-plants.jpeg',
]

const missionIcons = [HeartPulse, Leaf, HandHeart, PawPrint, GraduationCap]
const valueIcons = [HandHeart, BookOpen, Heart]
const joinIcons = [HandHeart, Package, IndianRupee, Share2]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = target
    const duration = 1600
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

function ImageCard({
  title,
  description,
  image,
}: {
  title: string
  description: string
  image: string
}) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        <Image src={image} alt={title} fill className="object-cover" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  )
}

export function HomepageClient() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <section className="relative w-full py-28 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" priority={i === 0} />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-7 max-w-4xl"
          >
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-5">
                {organizationName}
              </h1>
              <RotatingTagline className="text-xl md:text-3xl text-white/95 font-semibold leading-snug max-w-4xl" />
            </div>

            <div className="flex gap-3 text-white/90 max-w-3xl">
              <Quote className="h-6 w-6 flex-shrink-0 mt-1" />
              <p className="text-lg md:text-xl leading-relaxed">{mainQuote}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/donate">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold gap-2 px-8 py-3 h-auto rounded-lg text-lg">
                  <Heart className="h-5 w-5" />
                  Donate Now
                </Button>
              </Link>
              <Link href="/volunteer">
                <Button className="bg-white/10 hover:bg-white/20 text-white font-semibold gap-2 px-8 py-3 h-auto rounded-lg border-2 border-white/50 text-lg backdrop-blur-sm">
                  Join as Volunteer
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28 bg-card">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                About Us
              </h2>
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
              <Link href="/about">
                <Button variant="outline" className="gap-2 mt-2">
                  Learn More About Us <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/Activity-camp.jpeg"
                alt="Sansar Kalyan Trust volunteers and community supporters"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
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

      <section className="w-full py-20 md:py-28 bg-card">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
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

      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Key Programs
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {keyPrograms.map((program) => (
              <Card key={program.title} className="p-6 space-y-5">
                <div>
                  <p className="text-sm text-primary font-semibold mb-1">
                    {program.heading}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {program.title}
                  </h3>
                </div>
                <p className="text-primary font-semibold leading-relaxed">
                  {program.quote}
                </p>
                <ul className="space-y-3">
                  {program.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28 bg-green-600 dark:bg-green-800 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Achievements</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/85 text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28 bg-card">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Glimpses of Our Work
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {glimpses.map((item) => (
              <ImageCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              More from the Ground
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moreFromGround.map((item) => (
              <ImageCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28 bg-card">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Can You Join Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {joinOptions.map((option, index) => {
              const Icon = joinIcons[index]
              return (
                <Card key={option.title} className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-5">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 space-y-5">
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

            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <Image
                src="/donation_scanner.jpeg"
                alt="Sansar Kalyan Trust UPI QR code"
                width={260}
                height={260}
                className="rounded-lg border bg-white"
              />
              <p className="mt-5 font-semibold text-foreground">UPI (BHIM)</p>
              <p className="text-primary">{contactDetails.upi}</p>
            </Card>
          </div>
        </div>
      </section>

      <GovernmentRecognitions />
    </>
  )
}
