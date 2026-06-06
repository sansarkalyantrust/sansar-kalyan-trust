'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Heart, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/events', label: 'Events' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
  { href: '/volunteer', label: 'Volunteer' },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo and Tagline */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Sansar Kalyan Trust"
            className="h-12 w-12 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-primary text-base">
              Sansar Kalyan Trust
            </span>
            <span className="text-xs text-muted-foreground">
              Har Daan Ek Pehchaan
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Donate Button */}
          <Link href="/donate">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Donate</span>
            </Button>
          </Link>

          {/* Dark Mode Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-foreground"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle dark mode</span>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-foreground"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle mobile menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto max-w-7xl px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 px-3 text-foreground hover:text-primary hover:bg-card rounded-md font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
