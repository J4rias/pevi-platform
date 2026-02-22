import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/api-utils'

/**
 * POST /api/auth/signup
 * Register a new user with hashed password
 * Body: { fullName: string, email: string, password: string, role: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, role } = body

    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { error: 'All fields are required (fullName, email, password, role)' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role,
        status: 'active',
      },
    })

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
