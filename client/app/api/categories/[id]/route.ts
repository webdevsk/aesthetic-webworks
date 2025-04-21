import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { Category, categories } from "@/db/schema"
import { RouteApiType } from "@/types/api"
import { authenticateToken } from "@/utils/authenticate-token"
import { DatabaseError } from "@neondatabase/serverless"
import { eq } from "drizzle-orm"

// PUT /api/categories/:id - Update a category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<Category>>> {
  try {
    const { id } = await params
    await authenticateToken(req.headers)
    const { title } = await req.json()
    const slug = title.toLowerCase().replace(/\s+/g, "-")

    // Check if new title already exists for a different category
    const existingCategory = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.title, title))
      .limit(1)

    if (existingCategory.length > 0 && existingCategory[0].id !== parseInt(id)) {
      return NextResponse.json({ success: false, error: { message: "Category with this title already exists" } })
    }

    const [category] = await db
      .update(categories)
      .set({ title, slug })
      .where(eq(categories.id, parseInt(id)))
      .returning()

    if (!category) {
      return NextResponse.json({ success: false, error: { message: "Category not found" } })
    }

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to update category" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to update category" } })
    }
  }
}

// DELETE /api/categories/:id - Delete a category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<null>>> {
  try {
    const { id } = await params
    await authenticateToken(req.headers)

    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, parseInt(id)))
      .returning()

    if (!deletedCategory) {
      return NextResponse.json({ success: false, error: { message: "Category not found" } })
    }

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      if (error.code === "23503" && error.constraint === "project_categories_category_id_categories_id_fk") {
        return NextResponse.json({
          success: false,
          error: {
            code: error.code,
            message:
              "Cannot delete this category as it is being used by one or more projects. Please remove it from all projects first.",
          },
        })
      }
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to delete category" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to delete category" } })
    }
  }
}
