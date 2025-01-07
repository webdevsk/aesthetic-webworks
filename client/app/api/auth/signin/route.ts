import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!apiResponse.ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: apiResponse.status })
    }

    const data = await apiResponse.json()

    // Create response with cookie
    const response = new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

    response.cookies.set({
      name: "token",
      value: data.token,
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
