import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { createSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models'
import { getMockUsers } from '@/lib/mock-users'
import { loginSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = validation.data
    let user: any = null

    // Try MongoDB first
    const db = await connectDB()
    if (db) {
      user = await User.findOne({ email: email.toLowerCase() })
    }

    // Fallback to mock users
    if (!user) {
      const mockUsers = getMockUsers()
      user = mockUsers.find((u) => u.email === email.toLowerCase())
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      )
    }

    // Compare passwords
    const passwordMatch = await bcryptjs.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session
    await createSession({
      userId: user._id?.toString() || user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id?.toString() || user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
