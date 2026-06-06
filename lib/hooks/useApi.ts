import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const useCampaigns = () => {
  const { data, error, isLoading } = useSWR('/api/campaigns', fetcher)
  return {
    campaigns: data || [],
    isLoading,
    isError: !!error,
  }
}

export const useCampaign = (slug: string) => {
  const { data, error, isLoading } = useSWR(slug ? `/api/campaigns/${slug}` : null, fetcher)
  return {
    campaign: data,
    isLoading,
    isError: !!error,
  }
}

export const useEvents = () => {
  const { data, error, isLoading } = useSWR('/api/events', fetcher)
  return {
    events: Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [],
    isLoading,
    isError: !!error,
  }
}

export const useEvent = (slug: string) => {
  const { data, error, isLoading } = useSWR(slug ? `/api/events/${slug}` : null, fetcher)
  return {
    event: data,
    isLoading,
    isError: !!error,
  }
}

export const useBlogPosts = () => {
  const { data, error, isLoading } = useSWR('/api/blog', fetcher)
  return {
    posts: data || [],
    isLoading,
    isError: !!error,
  }
}

export const useBlogPost = (slug: string) => {
  const { data, error, isLoading } = useSWR(slug ? `/api/blog/${slug}` : null, fetcher)
  return {
    post: data,
    isLoading,
    isError: !!error,
  }
}

export const useGallery = () => {
  const { data, error, isLoading } = useSWR('/api/gallery', fetcher)
  return {
    gallery: data || [],
    isLoading,
    isError: !!error,
  }
}
