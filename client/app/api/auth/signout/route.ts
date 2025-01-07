import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function POST() {
//   const response = new NextResponse(JSON.stringify({ success: true }), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   })

  const cookieStore = await cookies()
  cookieStore.delete("token")
  return redirect("/")
}
