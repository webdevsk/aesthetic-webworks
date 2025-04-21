import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { Project, categories, projectCategories, projects } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { authenticateToken } from "@/utils/authenticate-token"
import { uploadToImgbb } from "@/utils/imgbb"
import { DatabaseError } from "@neondatabase/serverless"
import { eq, inArray } from "drizzle-orm"
import { z } from "zod"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<Project>>> {
  try {
    const { id } = await params
    await authenticateToken(req.headers)
    const formData = await req.formData()

    // Extract and validate fields using zod
    const ProjectUpdateSchema = z.object({
      title: z.string().min(1),
      isLatest: z.union([z.string(), z.boolean()]).transform((val) => val === "true" || val === true),
      categories: z.string().optional(), // Will be parsed as JSON or comma-separated
    })

    const raw = {
      title: formData.get("title"),
      isLatest: formData.get("isLatest"),
      categories: formData.get("categories") || undefined,
    }
    const parsed = ProjectUpdateSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { message: JSON.stringify(parsed.error.flatten()) } })
    }
    const { title, isLatest, categories: categoryTitlesRaw } = parsed.data

    // Parse categories to array
    let categoryTitles: string[] = []
    if (typeof categoryTitlesRaw === "string") {
      try {
        categoryTitles = JSON.parse(categoryTitlesRaw)
      } catch {
        categoryTitles = categoryTitlesRaw.split(",").map((t: string) => t.trim())
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

    // Get the current project
    const [currentProject] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
    if (!currentProject) {
      return NextResponse.json({ success: false, error: { message: "Project not found" } })
    }

    const updateData: Partial<Project> = {
      title,
      slug,
      isLatest,
    }
    if (imageUrl) {
      updateData.image = imageUrl
    }

    const [project] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, parseInt(id)))
      .returning()

    // Remove existing categories
    await db.delete(projectCategories).where(eq(projectCategories.projectId, parseInt(id)))

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
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to update project" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to update project" } })
    }
  }
}

// DELETE /api/projects/:id - Delete a project (no file deletion)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<null>>> {
  try {
    const { id } = await params
    await authenticateToken(req.headers)

    // Delete associated categories first
    await db.delete(projectCategories).where(eq(projectCategories.projectId, parseInt(id)))

    // Delete the project
    await db.delete(projects).where(eq(projects.id, parseInt(id)))

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to delete project" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to delete project" } })
    }
  }
}
