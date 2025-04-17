import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { projects, projectCategories, categories } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { authenticateToken } from "@/server/middleware/auth"

// PUT /api/projects/:id - Update a project (no file upload)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateToken(req.headers)
    const { title, categories: categoryTitles, isLatest } = await req.json()
    const slug = title.toLowerCase().replace(/\s+/g, "-")

    // Get the current project
    const [currentProject] = await db.select().from(projects).where(eq(projects.id, parseInt(params.id)))
    if (!currentProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const updateData: any = {
      title,
      slug,
      isLatest: !!isLatest,
    }

    const [project] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, parseInt(params.id)))
      .returning()

    // Remove existing categories
    await db.delete(projectCategories).where(eq(projectCategories.projectId, parseInt(params.id)))

    if (categoryTitles) {
      const categoryTitlesArray = Array.isArray(categoryTitles) ? categoryTitles : [categoryTitles]
      const existingCategories = await db
        .select()
        .from(categories)
        .where(inArray(categories.title, categoryTitlesArray.map((t: string) => t.trim())))

      if (existingCategories.length > 0) {
        await db.insert(projectCategories).values(
          existingCategories.map((category) => ({
            projectId: project.id,
            categoryId: category.id,
          }))
        )
      }
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE /api/projects/:id - Delete a project (no file deletion)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateToken(req.headers)
    const id = params.id

    // Delete associated categories first
    await db.delete(projectCategories).where(eq(projectCategories.projectId, parseInt(id)))

    // Delete the project
    await db.delete(projects).where(eq(projects.id, parseInt(id)))

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
