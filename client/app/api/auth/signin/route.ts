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

    // Find user
    const [user] = await db.select().from(users).where(eq(users.username, username))
    if (!user) {
      return NextResponse.json({ error: "Please sign up first" }, { status: 401 })
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: "Incorrect Password" }, { status: 401 })
    }

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
    return NextResponse.json({ error: "An error occurred during sign in" }, { status: 500 })
  }
}

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()
//     const { username, password } = body

//     const apiResponse = await fetch(API_URLS.auth.signin, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     })

//     if (!apiResponse.ok) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: apiResponse.status })
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
//     return NextResponse.json({ error: "An error occurred during sign in" }, { status: 500 })
//   }
// }
