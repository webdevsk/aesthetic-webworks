import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { DatabaseError } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"

export async function POST(request: Request): Promise<NextResponse<RouteApiType<{ token: string }>>> {
  try {
    const body = await request.json()
    const { username, password } = body

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.username, username))
    if (existingUser.length > 0) {
      return NextResponse.json({ success: false, error: { message: "Username already exists" } })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning()

    // Generate token
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!)

    // Set cookie
    const response = NextResponse.json({ success: true, data: { token } })
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    return response as NextResponse<RouteApiType<{ token: string }>>
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to create account" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to create account" } })
    }
  }
}
// export async function POST(request: Request): Promise<NextResponse<RouteApiType<{ token: string }>>> {
//   try {
//     const body = await request.json()
//     const { username, password } = body

//     const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     })

//     if (!apiResponse.ok) {
//       return NextResponse.json({ success: false, error: { message: "Failed to create account" } })
//     }

//     const data = await apiResponse.json()

//     // Set cookie
//     const response = NextResponse.json({ success: true, data: { token: data.token } })
//     response.cookies.set({
//       name: "token",
//       value: data.token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//     })
//     return response
//   } catch (error) {
//     return NextResponse.json({ success: false, error: { message: "An error occurred during sign up" } })
//   }
// }
