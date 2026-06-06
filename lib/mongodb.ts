import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

export async function connectDB() {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not defined - using mock data mode')
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('MongoDB connection error:', e)
    return null
  }

  return cached.conn
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1
}

export async function isMongoConnected() {
  if (!MONGODB_URI) return false
  try {
    await connectDB()
    return mongoose.connection.readyState === 1
  } catch (e) {
    return false
  }
}
