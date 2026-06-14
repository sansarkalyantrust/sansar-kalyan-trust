import bcryptjs from 'bcryptjs'
import { connectDB } from './mongodb'
import { User } from './models'

export async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin auto-seed')
    return
  }

  const db = await connectDB()
  if (!db) {
    console.warn('No database connection — skipping admin auto-seed')
    return
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    console.log(`Admin account exists: ${email}`)
    return
  }

  const hashedPassword = await bcryptjs.hash(password, 10)
  await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    name: 'Super Admin',
    role: 'superadmin',
    isActive: true,
  })

  console.log(`Admin account created from env: ${email}`)
}
