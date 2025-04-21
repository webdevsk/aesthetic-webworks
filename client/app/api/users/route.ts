import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { DatabaseError } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

type UserData = {
  id: number
  username: string
  token: string
}

// POST /api/users/register - Register a new user
export async function POST(req: NextRequest): Promise<NextResponse<RouteApiType<UserData>>> {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ success: false, error: { message: "Username and password are required" } })
    }
    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.username, username)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: { message: "Username already exists" } })
    }
    const hashed = await bcrypt.hash(password, 10)
    const [user] = await db.insert(users).values({ username, password: hashed }).returning()
    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" })
    return NextResponse.json({ success: true, data: { id: user.id, username: user.username, token } })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to register user" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to register user" } })
    }
  }
}

// POST /api/users/login - Login user
export async function PUT(req: NextRequest): Promise<NextResponse<RouteApiType<UserData>>> {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ success: false, error: { message: "Username and password are required" } })
    }
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: "Invalid credentials" } })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ success: false, error: { message: "Invalid credentials" } })
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" })
    return NextResponse.json({ success: true, data: { id: user.id, username: user.username, token } })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to login" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to login" } })
    }
  }
}
