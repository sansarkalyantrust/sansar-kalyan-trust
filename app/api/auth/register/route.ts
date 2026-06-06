import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models'
import { addMockUser, findMockUserByEmail } from '@/lib/mock-users'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, name, role } = validation.data

    // Try MongoDB first
    const db = await connectDB()

    if (db) {
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        )
      }

      const hashedPassword = await bcryptjs.hash(password, 10)
      const newUser = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: role || 'admin',
        isActive: true,
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Registration successful. Please login to continue.',
          user: {
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
        },
        { status: 201 }
      )
    }

    // Fallback to mock storage
    const existingUser = findMockUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    const newUser = {
      _id: Math.random().toString(36).substring(7),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: (role || 'admin') as 'superadmin' | 'admin' | 'editor',
      isActive: true,
      createdAt: new Date(),
    }

    addMockUser(newUser)

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please login to continue.',
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    )
  }
}
