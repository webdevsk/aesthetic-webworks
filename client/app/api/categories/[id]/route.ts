import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { categories } from "@/db/schema"
import { authenticateToken } from "@/server/middleware/auth"
import { eq } from "drizzle-orm"

// PUT /api/categories/:id - Update a category
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateToken(req.headers)
    const { title } = await req.json()
    const slug = title.toLowerCase().replace(/\s+/g, "-")

    // Check if new title already exists for a different category
    const existingCategory = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.title, title))
      .limit(1)

    if (existingCategory.length > 0 && existingCategory[0].id !== parseInt(params.id)) {
      return NextResponse.json({ error: "Category with this title already exists" }, { status: 400 })
    }

    const [category] = await db
      .update(categories)
      .set({ title, slug })
      .where(eq(categories.id, parseInt(params.id)))
      .returning()

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

// DELETE /api/categories/:id - Delete a category
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateToken(req.headers)
    const id = params.id

    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, parseInt(id)))
      .returning()

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return new Response(null, { status: 204 })
  } catch (error: any) {
    console.error(error)
    if (error.code === "23503" && error.constraint === "project_categories_category_id_categories_id_fk") {
      return NextResponse.json(
        {
          error:
            "Cannot delete this category as it is being used by one or more projects. Please remove it from all projects first.",
        },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
