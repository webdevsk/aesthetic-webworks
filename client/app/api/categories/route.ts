import { NextRequest, NextResponse } from "next/server"
import type { Category } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { listCategories, createCategory } from "@/lib/categoryOperations"

// GET /api/categories - Get all categories
export async function GET(): Promise<NextResponse<RouteApiType<Category[]>>> {
  const result = await listCategories()
  return NextResponse.json(result)
}

// POST /api/categories - Create a new category
export async function POST(req: NextRequest): Promise<NextResponse<RouteApiType<Category>>> {
  const { title } = await req.json()
  const result = await createCategory(title)
  return NextResponse.json(result)
}
