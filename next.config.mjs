/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production'



const securityHeaders = [

  {

    key: 'X-Frame-Options',

    value: 'DENY',

  },

  {

    key: 'X-Content-Type-Options',

    value: 'nosniff',

  },

  {

    key: 'Referrer-Policy',

    value: 'origin-when-cross-origin',

  },

  {

    key: 'X-XSS-Protection',

    value: '1; mode=block',

  },

  {

    key: 'Content-Security-Policy',

    value: [

      "default-src 'self'",

      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://va.vercel-scripts.com",

      "style-src 'self' 'unsafe-inline'",

      "img-src 'self' data: blob: https:",

      "font-src 'self' data:",

      "connect-src 'self' https://api.razorpay.com https://res.cloudinary.com https://va.vercel-scripts.com",

      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",

      "object-src 'none'",

      "base-uri 'self'",

      "form-action 'self'",

    ].join('; '),

  },

]



if (isProduction) {

  securityHeaders.push({

    key: 'Strict-Transport-Security',

    value: 'max-age=63072000; includeSubDomains; preload',

  })

}



const nextConfig = {
  typescript: {

    ignoreBuildErrors: true,

  },

  images: {

    formats: ['image/avif', 'image/webp'],

    remotePatterns: [

      {

        protocol: 'https',

        hostname: '**',

      },

    ],

  },

  async headers() {

    return [

      {

        source: '/(.*)',

        headers: securityHeaders,

      },

    ]

  },

}



export default nextConfig

