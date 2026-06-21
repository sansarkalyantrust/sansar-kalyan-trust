'use client'

import Link from 'next/link'
import { Heart, Mail, MapPin, Phone } from 'lucide-react'
import { contactDetails, organizationName } from '@/lib/site-content'

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt={organizationName}
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="font-bold text-primary">Sansar Kalyan</div>
                <div className="text-xs text-muted-foreground">Trust</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sansar Kalyan Trust operates across five core pillars — health,
              nature, humanity, animal welfare, and education — believing that
              true development of society is only possible when every living
              being is cared for with dignity and love.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-sm text-muted-foreground hover:text-primary">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {contactDetails.registeredAddress}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${contactDetails.phoneHref}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {contactDetails.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {contactDetails.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Make a Difference</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your support can fund a child's education, a patient's medicine,
              or an animal's care.
            </p>
            <Link href="/donate" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 text-sm font-medium">
              <Heart className="h-4 w-4" />
              Donate Now
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col gap-4 sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {contactDetails.footerLine}
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {organizationName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
