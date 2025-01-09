import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FolderKanban, Home, LayoutGrid, LogOut, MessageSquareQuote, Tags } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("token")
  if (!token) {
    redirect("/auth/signin")
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex w-64 flex-col border-r bg-background px-3 py-4">
        <div className="mb-8">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/projects">
              <FolderKanban className="mr-2 h-4 w-4" />
              Projects
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/categories">
              <Tags className="mr-2 h-4 w-4" />
              Categories
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/testimonials">
              <MessageSquareQuote className="mr-2 h-4 w-4" />
              Testimonials
            </Link>
          </Button>
        </nav>
        <div className="mb-4 mt-auto flex flex-col gap-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <form action="/api/auth/signout" method="POST">
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="container py-6">{children}</main>
      </div>
    </div>
  )
}
