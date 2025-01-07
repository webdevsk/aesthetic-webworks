"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface User {
  id: number
  username: string
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          throw new Error("Not authenticated")
        }
        const data = await response.json()
        setUser(data)
      } catch (error) {
        router.push("/auth/signin")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  async function handleSignOut() {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      router.push("/auth/signin")
      router.refresh()
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.username}!</CardTitle>
          <CardDescription>This is your admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button variant="outline" asChild>
              <a href="/admin/projects">Manage Projects</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/categories">Manage Categories</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/testimonials">Manage Testimonials</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}