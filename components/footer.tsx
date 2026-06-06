'use client'

import Link from 'next/link'
import { Heart, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="Sansar Kalyan Trust"
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="font-bold text-primary">Sansar Kalyan</div>
                <div className="text-xs text-muted-foreground">Trust</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Dedicated to healthcare, education, and community development.
            </p>
          </div>

          {/* Quick Links */}
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
                <Link href="/#blog" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  India
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  +91 (XXXX) XXX-XXXX
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  info@sansarkalyan.org
                </span>
              </li>
            </ul>
          </div>

          {/* Donate */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Make a Difference</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your donation helps us reach more people in need.
            </p>
            <Link href="/donate" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 text-sm font-medium">
              <Heart className="h-4 w-4" />
              Donate Now
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Sansar Kalyan Trust. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
