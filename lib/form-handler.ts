export async function submitContactForm(data: {
  name: string
  email: string
  phone: string
  message: string
}) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit form')
    }
    
    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function submitVolunteerForm(data: {
  name: string
  email: string
  phone: string
  city: string
  skills: string[]
  motivation: string
}) {
  try {
    const response = await fetch('/api/volunteer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit volunteer application')
    }
    
    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function submitDonation(data: {
  amount: number
  donorName?: string
  donorEmail?: string
  method: 'online' | 'upi' | 'bank'
  campaignSlug?: string
}) {
  try {
    const response = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to process donation')
    }
    
    return await response.json()
  } catch (error) {
    throw error
  }
}
