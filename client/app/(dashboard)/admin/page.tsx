"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { API_URLS } from "@/lib/api-urls"
import { getCategories, getProjects, getTestimonials } from "@/lib/server-fetches"

interface Stats {
  projects: number
  categories: number
  testimonials: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    categories: 0,
    testimonials: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
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
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    fetchStats()
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
