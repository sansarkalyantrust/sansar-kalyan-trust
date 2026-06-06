'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { submitContactForm } from '@/lib/form-handler'

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      await submitContactForm(formData)
      setMessage({ type: 'success', text: 'Message sent successfully! We will get back to you soon.' })
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to send message. Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <h3 className="text-2xl font-bold text-foreground mb-6">Send us a message</h3>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Name
          </label>
          <Input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <Input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Phone
          </label>
          <Input
            type="tel"
            name="phone"
            placeholder="+91 XXXXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Message
          </label>
          <textarea
            name="message"
            placeholder="Your message here..."
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            minLength={10}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Card>
  )
}
