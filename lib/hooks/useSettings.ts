import useSWR from 'swr'
import {
  aboutParagraphs,
  contactDetails,
  englishTagline,
  organizationName,
} from '@/lib/site-content'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const DEFAULT_HERO = {
  title: organizationName,
  subtitle: englishTagline,
  description: aboutParagraphs.join(' '),
  cta: 'Donate Now',
}

export const DEFAULT_IMPACT = {
  treesPlanted: 350,
  notebooksMade: 270,
  healthAwarenessCamps: 20,
  animalsProtected: 100,
}

export const DEFAULT_ABOUT = {
  mission: aboutParagraphs[1],
  vision: aboutParagraphs[0],
  description: aboutParagraphs.join(' '),
}

export const DEFAULT_CONTACT = {
  address: contactDetails.registeredAddress,
  phone: contactDetails.phone,
  email: contactDetails.email,
  whatsapp: contactDetails.phone,
}

export const DEFAULT_FOOTER = {
  tagline: aboutParagraphs[1],
  copyright: `© ${new Date().getFullYear()} ${organizationName}. All rights reserved.`,
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
    treesPlanted: raw.impact_numbers?.treesPlanted ?? DEFAULT_IMPACT.treesPlanted,
    notebooksMade: raw.impact_numbers?.notebooksMade ?? DEFAULT_IMPACT.notebooksMade,
    healthAwarenessCamps:
      raw.impact_numbers?.healthAwarenessCamps ?? DEFAULT_IMPACT.healthAwarenessCamps,
    animalsProtected:
      raw.impact_numbers?.animalsProtected ?? DEFAULT_IMPACT.animalsProtected,
  }

  const about = {
    mission: raw.about_content?.mission ?? DEFAULT_ABOUT.mission,
    vision: raw.about_content?.vision ?? DEFAULT_ABOUT.vision,
    description: raw.about_content?.description ?? DEFAULT_ABOUT.description,
  }

  const contact = {
    address: DEFAULT_CONTACT.address,
    phone: DEFAULT_CONTACT.phone,
    email: DEFAULT_CONTACT.email,
    whatsapp: DEFAULT_CONTACT.whatsapp,
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
