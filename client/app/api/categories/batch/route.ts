import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { Category, categories } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { authenticateToken } from "@/utils/authenticate-token"
import { DatabaseError } from "@neondatabase/serverless"
import { inArray } from "drizzle-orm"

// POST /api/categories/batch - Create multiple categories
export async function POST(req: NextRequest): Promise<NextResponse<RouteApiType<Category[]>>> {
  try {
    await authenticateToken()
    const { titles } = await req.json()
    if (!Array.isArray(titles)) {
      return NextResponse.json({ success: false, error: { message: "titles must be an array" } })
    }

    // Filter out duplicates
    const uniqueTitles = [...new Set(titles)]

    // Get existing categories in a single query
    const existingCategories = await db
      .select({ title: categories.title })
      .from(categories)
      .where(inArray(categories.title, uniqueTitles))

    // Filter out existing titles
    const existingTitles = new Set(existingCategories.map((c) => c.title))
    const newTitles = uniqueTitles.filter((title) => !existingTitles.has(title))

    if (newTitles.length === 0) {
      return NextResponse.json({ success: true, data: [] })
    }

    // Create all new categories in a single query
    const newCategories = await db
      .insert(categories)
      .values(
        newTitles.map((title) => ({
          title,
          slug: title.toLowerCase().replace(/\s+/g, "-"),
        }))
      )
      .returning()

    return NextResponse.json({ success: true, data: newCategories })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to create categories" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to create categories" } })
    }
  }
}
