import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const DEFAULT_HERO = {
  title: 'Sansar Kalyan Trust',
  subtitle: 'Har Daan Ek Pehchaan',
  description: 'Empowering communities through education, health, and environment. Every contribution creates lasting change.',
  cta: 'Donate Now',
}

export const DEFAULT_IMPACT = {
  familiesHelped: 5000,
  eventsOrganized: 150,
  volunteersActive: 200,
  donationsReceived: 1200000,
}

export const DEFAULT_ABOUT = {
  mission: 'Dedicated to uplifting communities through education, health camps, environmental initiatives, and sustainable livelihoods. We believe in empowering individuals to lead healthier, more productive, and dignified lives.',
  vision: 'A society where everyone has access to quality education, healthcare, and a clean environment. We envision communities empowered by knowledge, healthy in body and mind, and united in solidarity across Haryana and India.',
  description: 'Sansar Kalyan Trust is a registered non-profit organization dedicated to uplifting underprivileged communities through accessible healthcare, quality education, and sustainable environmental initiatives.',
}

export const DEFAULT_CONTACT = {
  address: 'House No 1239, First Floor, Sector 3, Rohtak, Haryana 124001, India',
  phone: '+91 (XXXX) XXX-XXXX',
  email: 'info@sansarkalyan.org',
  whatsapp: '+91 (XXXX) XXX-XXXX',
}

export const DEFAULT_FOOTER = {
  tagline: 'Dedicated to healthcare, education, and community development.',
  copyright: `© ${new Date().getFullYear()} Sansar Kalyan Trust. All rights reserved.`,
  socialLinks: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
  },
}

export function useSettings() {
  const { data, error, isLoading } = useSWR('/api/settings', fetcher)

  const raw = data?.data || {}

  const hero = {
    title: raw.homepage_hero?.title ?? DEFAULT_HERO.title,
    subtitle: raw.homepage_hero?.subtitle ?? DEFAULT_HERO.subtitle,
    description: raw.homepage_hero?.description ?? DEFAULT_HERO.description,
    cta: raw.homepage_hero?.cta ?? DEFAULT_HERO.cta,
  }

  const impact = {
    familiesHelped: raw.impact_numbers?.familiesHelped ?? DEFAULT_IMPACT.familiesHelped,
    eventsOrganized: raw.impact_numbers?.eventsOrganized ?? DEFAULT_IMPACT.eventsOrganized,
    volunteersActive: raw.impact_numbers?.volunteersActive ?? DEFAULT_IMPACT.volunteersActive,
    donationsReceived: raw.impact_numbers?.donationsReceived ?? DEFAULT_IMPACT.donationsReceived,
  }

  const about = {
    mission: raw.about_content?.mission ?? DEFAULT_ABOUT.mission,
    vision: raw.about_content?.vision ?? DEFAULT_ABOUT.vision,
    description: raw.about_content?.description ?? DEFAULT_ABOUT.description,
  }

  const contact = {
    address: raw.contact_info?.address ?? raw.footer_data?.address ?? DEFAULT_CONTACT.address,
    phone: raw.contact_info?.phone ?? raw.footer_data?.phone ?? DEFAULT_CONTACT.phone,
    email: raw.contact_info?.email ?? raw.footer_data?.email ?? DEFAULT_CONTACT.email,
    whatsapp: raw.contact_info?.whatsapp ?? DEFAULT_CONTACT.whatsapp,
  }

  const footer = {
    tagline: raw.footer_data?.tagline ?? DEFAULT_FOOTER.tagline,
    copyright: raw.footer_data?.copyright ?? DEFAULT_FOOTER.copyright,
    socialLinks: {
      ...DEFAULT_FOOTER.socialLinks,
      ...(raw.footer_data?.socialLinks || {}),
    },
  }

  return {
    raw,
    hero,
    impact,
    about,
    contact,
    footer,
    isLoading,
    isError: !!error,
  }
}
