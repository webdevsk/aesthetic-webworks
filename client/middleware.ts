import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // NOT SECURE. CHECK WITHIN PAGE INSTEAD
  // if (request.nextUrl.pathname.startsWith("/admin")) {
  //   const token = request.cookies.get("token")?.value

  //   if (!token) {
  //     return NextResponse.redirect(new URL("/auth/signin", request.url))
  //   }
  // }
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
