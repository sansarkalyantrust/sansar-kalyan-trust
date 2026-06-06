// This module stores mock users for authentication when MongoDB is not connected
// In production with MongoDB, this is used as fallback only

import bcryptjs from 'bcryptjs'

interface MockUser {
  _id: string
  email: string
  password: string
  name: string
  role: 'superadmin' | 'admin' | 'editor'
  isActive: boolean
  createdAt: Date
}

// Pre-hashed password for "Admin@123"
const ADMIN_HASH = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'

// Global mock users storage
let mockUsers: MockUser[] = [
  {
    _id: 'superadmin-1',
    email: 'admin@sansarkalyan.org',
    password: ADMIN_HASH,
    name: 'Super Admin',
    role: 'superadmin',
    isActive: true,
    createdAt: new Date(),
  },
]

// Initialize the admin password hash
async function initAdminHash() {
  const hash = await bcryptjs.hash('Admin@123', 10)
  mockUsers[0].password = hash
}
initAdminHash()

export function getMockUsers(): MockUser[] {
  return mockUsers
}

export function addMockUser(user: MockUser): void {
  mockUsers.push(user)
}

export function findMockUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find((u) => u.email === email.toLowerCase())
}

export function clearMockUsers(): void {
  mockUsers = []
}
