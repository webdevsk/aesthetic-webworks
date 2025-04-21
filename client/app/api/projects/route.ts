import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { categories, projectCategories, projects } from "@/db/schema"
import type { Project } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { authenticateToken } from "@/utils/authenticate-token"
import { uploadToImgbb } from "@/utils/imgbb"
import { DatabaseError } from "@neondatabase/serverless"
import { eq, inArray } from "drizzle-orm"
import { z } from "zod"

// GET /api/projects - List all projects with categories
export async function GET(): Promise<NextResponse<RouteApiType<Array<Project & { categories: string[] }>>>> {
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
      .where(
        projectIds.length > 0 ? inArray(projectCategories.projectId, projectIds) : eq(projectCategories.projectId, -1)
      )

    // Group categories by project
    const categoriesByProject = allProjectCategories.reduce(
      (acc, pc) => {
        if (!acc[pc.projectId]) {
          acc[pc.projectId] = []
        }
        acc[pc.projectId].push(pc.categoryTitle)
        return acc
      },
      {} as Record<number, string[]>
    )

    // Map projects with their categories
    const result = projectsList.map((project) => ({
      ...project,
      categories: categoriesByProject[project.id] || [],
    }))

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to fetch projects" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to fetch projects" } })
    }
  }
}

// POST /api/projects - Create a new project (with file upload)
export async function POST(req: NextRequest): Promise<NextResponse<RouteApiType<Project>>> {
  try {
    await authenticateToken(req.headers)
    const formData = await req.formData()
    console.log(Object.fromEntries(formData))
    // Extract and validate fields using zod
    const ProjectCreateSchema = z.object({
      title: z.string().min(1),
      isLatest: z
        .string()
        .optional()
        .transform((val) => !!val && val === "true"),
      categories: z.string().optional(),
    })

    const raw = {
      title: formData.get("title"),
      isLatest: formData.get("isLatest") || undefined,
      categories: formData.get("categories") || undefined,
    }
    const parsed = ProjectCreateSchema.safeParse(raw)
    if (!parsed.success) {
      // Flatten the error into a string for RouteApiType
      const message = JSON.stringify(parsed.error.flatten())
      return NextResponse.json({ success: false, error: { message } })
    }
    const { title, isLatest, categories: categoryTitlesRaw } = parsed.data

    // Parse categories to array
    let categoryTitles: string[] = []
    if (typeof categoryTitlesRaw === "string") {
      try {
        categoryTitles = JSON.parse(categoryTitlesRaw)
        if (!Array.isArray(categoryTitles)) categoryTitles = []
      } catch {
        categoryTitles = categoryTitlesRaw
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      }
    }

    // Extract file
    let imageUrl: string | undefined
    const file = formData.get("image") as File | null
    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      imageUrl = await uploadToImgbb(buffer, process.env.IMGBB_API_KEY!, file.name)
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-")

    // Create project
    const [project] = await db
      .insert(projects)
      .values({
        title,
        slug,
        image: imageUrl,
        isLatest,
      })
      .returning()

    // Add categories
    if (categoryTitles.length > 0) {
      const existingCategories = await db
        .select()
        .from(categories)
        .where(
          inArray(
            categories.title,
            categoryTitles.map((t: string) => t.trim())
          )
        )

      if (existingCategories.length > 0) {
        await db.insert(projectCategories).values(
          existingCategories.map((category) => ({
            projectId: project.id,
            categoryId: category.id,
          }))
        )
      }
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: { message: "Failed to create project" } })
  }
}
