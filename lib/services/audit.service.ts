import { connectDB } from '@/lib/mongodb'
import { AuditLog } from '@/lib/models'
import type { SessionPayload } from '@/lib/auth'

export type AuditAction =
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'upload'
  | 'media_remove'
  | 'publish'
  | 'unpublish'

export async function logAudit(
  session: SessionPayload | null,
  action: AuditAction,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const db = await connectDB()
    if (!db) return

    await AuditLog.create({
      userId: session?.userId,
      email: session?.email || 'system',
      action,
      entityType,
      entityId,
      metadata,
    })
  } catch (error) {
    console.error('Audit log error:', error)
  }
}
