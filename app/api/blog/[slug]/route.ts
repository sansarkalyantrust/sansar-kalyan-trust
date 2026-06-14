import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, requireAdminRole, canDelete } from '@/lib/api-auth'
import { connectDB } from '@/lib/mongodb'
import { Blog } from '@/lib/models'
import { logAudit } from '@/lib/services/audit.service'
import { blogUpdateSchema, syncMediaFields } from '@/lib/validations'
import { sanitizeHtml } from '@/lib/sanitize-html'

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
  const auth = await requireEditor(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { slug } = await params
    const body = await request.json()

    const validation = blogUpdateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const data = syncMediaFields(validation.data)
    if (data.content) {
      data.content = sanitizeHtml(data.content)
    }
    if (data.status === 'published') (data as Record<string, unknown>).published = true
    if (data.status === 'draft') (data as Record<string, unknown>).published = false

    const db = await connectDB()
    if (db) {
      const blog = await Blog.findOneAndUpdate(
        { slug },
        { $set: data },
        { new: true }
      )
      if (!blog) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'update', 'blog', blog._id.toString(), { slug })
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
  const auth = await requireAdminRole(request)
  if (auth instanceof NextResponse) return auth
  if (!canDelete(auth.session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { slug } = await params
    const db = await connectDB()

    if (db) {
      const blog = await Blog.findOneAndDelete({ slug })
      if (!blog) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
      }
      await logAudit(auth.session, 'delete', 'blog', blog._id.toString(), { slug })
      return NextResponse.json({ success: true, message: 'Blog post deleted' })
    }

    return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
