import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Blog } from '@/lib/models'
import { blogUpdateSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const db = await connectDB()

    if (db) {
      const blog = await Blog.findOne({ slug }).lean()
      if (!blog) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
      return NextResponse.json(blog)
    }

    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    const validation = blogUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const db = await connectDB()
    if (db) {
      const blog = await Blog.findOneAndUpdate(
        { slug },
        { $set: validation.data },
        { new: true }
      )
      if (!blog) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
      return NextResponse.json(blog)
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const db = await connectDB()

    if (db) {
      const blog = await Blog.findOneAndDelete({ slug })
      if (!blog) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, message: 'Blog post deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
