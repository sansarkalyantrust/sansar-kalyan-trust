type RateLimitStore = {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  max: number // Max requests per window
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

export function rateLimit(
  ip: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, max: 10 }
): RateLimitResult {
  const { windowMs, max } = options
  const now = Date.now()
  
  if (!store[ip] || store[ip].resetTime < now) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    }
    return {
      success: true,
      remaining: max - 1,
      resetTime: now + windowMs,
    }
  }
  
  store[ip].count++
  
  if (store[ip].count > max) {
    return {
      success: false,
      remaining: 0,
      resetTime: store[ip].resetTime,
    }
  }
  
  return {
    success: true,
    remaining: max - store[ip].count,
    resetTime: store[ip].resetTime,
  }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((ip) => {
    if (store[ip].resetTime < now) {
      delete store[ip]
    }
  })
}, 60 * 60 * 1000) // Clean up every hour
