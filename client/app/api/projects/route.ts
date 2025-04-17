import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { projects, projectCategories, categories } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"

// GET /api/projects - List all projects with categories
export async function GET() {
  try {
    const projectsList = await db.select().from(projects)
    const projectIds = projectsList.map((p) => p.id)

    // Fetch all categories for all projects in a single query
    const allProjectCategories = await db
      .select({
        projectId: projectCategories.projectId,
        categoryTitle: categories.title,
      })
      .from(projectCategories)
      .innerJoin(categories, eq(categories.id, projectCategories.categoryId))
      .where(inArray(projectCategories.projectId, projectIds))

    // Group categories by project
    const categoriesByProject = allProjectCategories.reduce((acc, pc) => {
      if (!acc[pc.projectId]) {
        acc[pc.projectId] = []
      }
      acc[pc.projectId].push(pc.categoryTitle)
      return acc
    }, {} as Record<number, string[]>)

    // Map projects with their categories
    const result = projectsList.map((project) => ({
      ...project,
      categories: categoriesByProject[project.id] || [],
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
