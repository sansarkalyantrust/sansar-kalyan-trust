// Environment variable validation
interface EnvConfig {
  required: string[]
  optional: string[]
}

const productionConfig: EnvConfig = {
  required: [
    'MONGODB_URI',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
    'AUTH_SECRET',
  ],
  optional: [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'NEXT_PUBLIC_APP_URL',
  ],
}

const developmentConfig: EnvConfig = {
  required: [
    'AUTH_SECRET',
  ],
  optional: [
    'MONGODB_URI',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'NEXT_PUBLIC_APP_URL',
  ],
}

export function validateEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production'
  const config = isProduction ? productionConfig : developmentConfig
  
  const missing: string[] = []
  const warnings: string[] = []
  
  // Check required variables
  config.required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key)
    }
  })
  
  // Check optional variables and warn
  config.optional.forEach((key) => {
    if (!process.env[key]) {
      warnings.push(key)
    }
  })
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach((key) => console.error(`   - ${key}`))
    
    if (isProduction) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  Missing optional environment variables (using mock data/fallbacks):')
    warnings.forEach((key) => console.warn(`   - ${key}`))
  }
  
  // Additional validation
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
    console.warn('⚠️  MONGODB_URI does not appear to be a valid MongoDB connection string')
  }
  
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.startsWith('http')) {
    console.warn('⚠️  NEXT_PUBLIC_APP_URL should start with http:// or https://')
  }
  
  console.log('✅ Environment validation complete')
  console.log(`   Mode: ${isProduction ? 'Production' : 'Development'}`)
  console.log(`   Missing required: ${missing.length}`)
  console.log(`   Missing optional: ${warnings.length}`)
  
  return {
    isValid: missing.length === 0 || !isProduction,
    missing,
    warnings,
  }
}

// Run validation on startup
if (typeof window === 'undefined') {
  validateEnvironment()
}
