import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.username, username))
    if (existingUser.length > 0) {
      return new NextResponse(JSON.stringify({ error: "Username already exists" }))
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

    // Create response with cookie
    const response = new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return response
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 })
  }
}
// export async function POST(request: Request) {
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
//       return NextResponse.json({ error: "Failed to create account" }, { status: apiResponse.status })
//     }

//     const data = await apiResponse.json()

//     // Create response with cookie
//     const response = new NextResponse(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     })

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
//     return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 })
//   }
// }
