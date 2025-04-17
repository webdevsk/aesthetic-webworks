import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { categories } from "@/db/schema"
import { authenticateToken } from "@/server/middleware/auth"
import { inArray } from "drizzle-orm"

// POST /api/categories/batch - Create multiple categories
export async function POST(req: NextRequest) {
  try {
    await authenticateToken(req.headers)
    const { titles } = await req.json()
    if (!Array.isArray(titles)) {
      return NextResponse.json({ error: "titles must be an array" }, { status: 400 })
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
      return NextResponse.json({ message: "No new categories to create" }, { status: 200 })
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

    return NextResponse.json(newCategories, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create categories" }, { status: 500 })
  }
}
