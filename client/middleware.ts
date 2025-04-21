import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { BASE_URL } from "./lib/api-urls"

export function middleware(request: NextRequest) {
  console.log(request)

  if (request.nextUrl.pathname.startsWith("/admin/")) {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    // console.log(request.url, request.nextUrl)
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set("Access-Control-Allow-Origin", BASE_URL)
    // response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT")
    response.headers.set(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    )
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
