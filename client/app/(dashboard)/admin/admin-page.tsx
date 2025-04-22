"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjects } from "@/lib/client-side-api-handlers"
import { getCategories } from "@/lib/client-side-api-handlers"
import { getTestimonials } from "@/lib/client-side-api-handlers"
import { toast } from "sonner"

interface Stats {
  projects: number
  categories: number
  testimonials: number
}

export function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    categories: 0,
    testimonials: 0,
  })

  useEffect(() => {
    toast.promise(
      async function fetchStats() {
        const [projectsRes, categoriesRes, testimonialsRes] = await Promise.all([
          getProjects(),
          getCategories(),
          getTestimonials(),
        ])

        if (!projectsRes.success || !categoriesRes.success || !testimonialsRes.success) {
          throw new Error("Failed to fetch stats")
        }
        setStats({
          projects: projectsRes.data.length,
          categories: categoriesRes.data.length,
          testimonials: testimonialsRes.data.length,
        })
      },
      {
        loading: "Loading stats...",
        // success: "Stats loaded",
        error: (err) => err.message || "Failed to fetch stats",
      }
    )
  }, [])

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Total number of projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.projects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Total number of categories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.categories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>Total number of testimonials</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.testimonials}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
