import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { Category, categories } from "@/db/schema"
import { RouteApiType } from "@/types/api"
import { authenticateToken } from "@/utils/authenticate-token"
import { DatabaseError } from "@neondatabase/serverless"
import { eq } from "drizzle-orm"

// GET /api/categories - Get all categories
export async function GET(): Promise<NextResponse<RouteApiType<Category[]>>> {
  try {
    const result = await db.select().from(categories)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to fetch categories" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to fetch categories" } })
    }
  }
}

// POST /api/categories - Create a new category
export async function POST(req: NextRequest): Promise<NextResponse<RouteApiType<Category>>> {
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
      return NextResponse.json({ success: false, error: { message: "Category already exists" } })
    }

    const [category] = await db.insert(categories).values({ title, slug }).returning()
    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to create category" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to create category" } })
    }
  }
}
