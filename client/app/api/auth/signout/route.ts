import { NextResponse } from "next/server"

export async function POST() {
  const response = new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })

  response.cookies.delete("token")

  return response
}
