'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, Stethoscope, BookOpen, Sprout, ArrowRight, Users, Calendar, HandHeart, Star, Quote } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { SlideUp, FadeIn, ScaleIn, StaggerChildren, StaggerItem } from '@/components/motion-wrapper'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const heroImages = [
  '/Activity-camp.jpeg',
  '/Help_activity.jpeg',
  '/medicine_camp.jpeg',
  '/school_camp.jpeg',
]

const impactStats = [
  { label: 'Families Helped', value: 5000, suffix: '+' },
  { label: 'Events Organized', value: 150, suffix: '+' },
  { label: 'Active Volunteers', value: 200, suffix: '+' },
  { label: 'Donations Received', value: 12, suffix: 'L+' },
]

const galleryPreview = [
  { src: '/Activity-1.jpeg', alt: 'Community Activity' },
  { src: '/Help_childs.jpeg', alt: 'Helping Children' },
  { src: '/Activity-plants.jpeg', alt: 'Tree Plantation' },
  { src: '/medicine_camp2.jpeg', alt: 'Health Camp' },
  { src: '/gifts_students.jpeg', alt: 'Student Gifts' },
  { src: '/help_cloth_charity.jpeg', alt: 'Cloth Charity' },
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = target
    const duration = 2000
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>
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
      {/* Hero Section */}
      <section className="relative w-full py-32 md:py-48 overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === currentImage ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image src={img} alt="" fill className="object-cover" priority={i === 0} />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 max-w-3xl"
          >
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
                Sansar Kalyan Trust
              </h1>
              <h2 className="text-2xl md:text-3xl text-white/90 font-semibold mb-6">
                Har Daan Ek Pehchaan
              </h2>
            </div>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
              Empowering communities through education, health, and environment. Every contribution creates lasting change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
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

      {/* About Section */}
      <section className="w-full py-20 md:py-28 bg-card">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SlideUp>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  About Sansar Kalyan Trust
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Sansar Kalyan Trust is a registered non-profit organization dedicated to uplifting underprivileged communities through accessible healthcare, quality education, and sustainable environmental initiatives.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Founded with the vision of creating a world where every individual has equal opportunities, we have been serving communities across India through health camps, free education programs, environmental conservation, and community welfare.
                </p>
                <Link href="/about">
                  <Button variant="outline" className="gap-2 mt-4">
                    Learn More About Us <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </SlideUp>
            <ScaleIn delay={0.2}>
              <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/founder_SankarRana.jpeg"
                  alt="Founder - Sankar Rana"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white font-semibold">Sankar Rana</p>
                  <p className="text-white/80 text-sm">Founder, Sansar Kalyan Trust</p>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <SlideUp>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Focus Areas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We work across multiple sectors to create sustainable impact in communities.
              </p>
            </div>
          </SlideUp>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-green-200 dark:border-green-800 hover:-translate-y-1">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-5">
                  <Stethoscope className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Healthcare</h3>
                <p className="text-muted-foreground mb-4">
                  Providing medical support, health camps, and awareness programs to rural areas.
                </p>
                <Link href="/campaigns" className="inline-flex items-center text-green-600 font-semibold hover:gap-2 transition-all gap-1">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-blue-200 dark:border-blue-800 hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-5">
                  <BookOpen className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Education</h3>
                <p className="text-muted-foreground mb-4">
                  Supporting education through scholarships, skill development, and mentorship programs.
                </p>
                <Link href="/campaigns" className="inline-flex items-center text-blue-600 font-semibold hover:gap-2 transition-all gap-1">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-amber-200 dark:border-amber-800 hover:-translate-y-1">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center mb-5">
                  <Sprout className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Community Growth</h3>
                <p className="text-muted-foreground mb-4">
                  Building sustainable livelihoods and environmental conservation initiatives.
                </p>
                <Link href="/campaigns" className="inline-flex items-center text-amber-600 font-semibold hover:gap-2 transition-all gap-1">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="w-full py-20 md:py-28 bg-green-600 dark:bg-green-800 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
              <p className="text-lg text-white/80">Numbers that reflect our commitment to service</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, i) => (
              <SlideUp key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/80 text-sm md:text-base">{stat.label}</p>
                </div>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="w-full py-20 md:py-28 bg-card">
        <div className="container mx-auto max-w-6xl px-4">
          <SlideUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Gallery</h2>
              <p className="text-lg text-muted-foreground">Moments captured from our initiatives</p>
            </div>
          </SlideUp>
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryPreview.map((img) => (
              <StaggerItem key={img.src}>
                <div className="relative h-48 md:h-64 rounded-xl overflow-hidden group">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          <div className="text-center mt-8">
            <Link href="/gallery">
              <Button variant="outline" className="gap-2">
                View Full Gallery <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="w-full py-20 md:py-28 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <SlideUp>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Us in Making a Difference
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Every contribution, no matter how small, helps us reach more people in need. Together, we can transform lives and build stronger communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate">
                <Button className="bg-white hover:bg-white/90 text-green-700 font-semibold px-8 py-3 h-auto gap-2 text-lg">
                  <Heart className="h-5 w-5" />
                  Donate Now
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 h-auto gap-2 text-lg border border-white/30">
                  View Campaigns
                </Button>
              </Link>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <SlideUp delay={0}>
              <Card className="p-8">
                <HandHeart className="h-10 w-10 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Volunteer</h3>
                <p className="text-muted-foreground mb-4">Join our team and make a direct impact</p>
                <Link href="/volunteer">
                  <Button variant="outline" size="sm">Apply Now</Button>
                </Link>
              </Card>
            </SlideUp>
            <SlideUp delay={0.1}>
              <Card className="p-8">
                <Calendar className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Events</h3>
                <p className="text-muted-foreground mb-4">Participate in our upcoming programs</p>
                <Link href="/events">
                  <Button variant="outline" size="sm">View Events</Button>
                </Link>
              </Card>
            </SlideUp>
            <SlideUp delay={0.2}>
              <Card className="p-8">
                <Users className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Contact Us</h3>
                <p className="text-muted-foreground mb-4">Get in touch for collaborations</p>
                <Link href="/contact">
                  <Button variant="outline" size="sm">Reach Out</Button>
                </Link>
              </Card>
            </SlideUp>
          </div>
        </div>
      </section>
    </>
  )
}
