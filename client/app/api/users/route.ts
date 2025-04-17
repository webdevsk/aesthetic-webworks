import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// POST /api/users/register - Register a new user
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }
    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.username, username)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }
    const hashed = await bcrypt.hash(password, 10)
    const [user] = await db.insert(users).values({ username, password: hashed }).returning()
    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" })
    return NextResponse.json({ id: user.id, username: user.username, token }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}

// POST /api/users/login - Login user
export async function PUT(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" })
    return NextResponse.json({ id: user.id, username: user.username, token })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
