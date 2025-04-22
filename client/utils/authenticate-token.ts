import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ErrorApiType } from "@/types/api"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AuthUser {
  id: number
  username: string
}

/**
 * Authenticate a JWT from request headers (Next.js API route/server action).
 * Throws an error if authentication fails.
 * Usage: await authenticateToken(headers)
 */
export async function authenticateToken(): Promise<NextResponse<ErrorApiType> | AuthUser> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) {
      throw new Error("Authentication required")
    }
    const user = jwt.verify(token, JWT_SECRET) as AuthUser
    return user
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ success: false, error: { code: "403", message: "Invalid token" } })
    }
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: { code: "403", message: error.message } })
    }
  }
  return NextResponse.json({ success: false, error: { code: "403", message: "Invalid token" } })
}
