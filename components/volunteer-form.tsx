'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { submitVolunteerForm } from '@/lib/form-handler'

const skillOptions = [
  'Teaching',
  'Medical',
  'Event management',
  'Social media',
  'Fundraising',
  'Other',
]

export function VolunteerForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    motivation: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedSkills.length === 0) {
      setMessage({
        type: 'error',
        text: 'Please select at least one skill.',
      })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      await submitVolunteerForm({
        ...formData,
        skills: selectedSkills,
      })
      setMessage({
        type: 'success',
        text: 'Application submitted successfully! Thank you for your interest in volunteering with us.',
      })
      setFormData({ name: '', email: '', phone: '', city: '', motivation: '' })
      setSelectedSkills([])
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to submit application. Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8 md:p-12">
      <h3 className="text-2xl font-bold text-foreground mb-6">Volunteer Application</h3>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Name <span className="text-accent">*</span>
          </label>
          <Input
            type="text"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email <span className="text-accent">*</span>
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
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone <span className="text-accent">*</span>
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
          <label className="block text-sm font-medium text-foreground mb-2">
            City <span className="text-accent">*</span>
          </label>
          <Input
            type="text"
            name="city"
            placeholder="Your city"
            value={formData.city}
            onChange={handleChange}
            required
            minLength={2}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Skills <span className="text-accent">*</span>
            <span className="text-xs text-muted-foreground ml-1">(Select at least one)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {skillOptions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-full border transition-colors disabled:opacity-50 ${
                  selectedSkills.includes(skill)
                    ? 'border-primary bg-primary text-white'
                    : 'border-primary text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Why do you want to volunteer? <span className="text-accent">*</span>
          </label>
          <textarea
            name="motivation"
            placeholder="Tell us about your passion and motivation..."
            rows={4}
            value={formData.motivation}
            onChange={handleChange}
            required
            minLength={10}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 h-auto"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Card>
  )
}
