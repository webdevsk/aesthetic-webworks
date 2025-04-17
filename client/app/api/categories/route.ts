import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { categories } from "@/db/schema"
import { authenticateToken } from "@/utils/authenticate-token"
import { eq } from "drizzle-orm"

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const result = await db.select().from(categories)
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// POST /api/categories - Create a new category
export async function POST(req: NextRequest) {
  try {
    await authenticateToken(req.headers)
    const { title } = await req.json()
    const slug = title.toLowerCase().replace(/\s+/g, "-")

    // Check if category already exists
    const existingCategory = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.title, title))
      .limit(1)

    if (existingCategory.length > 0) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 })
    }

    const [category] = await db.insert(categories).values({ title, slug }).returning()
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
