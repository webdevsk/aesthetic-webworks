import { NextRequest, NextResponse } from "next/server"
import type { Category } from "@/db/schema"
import { batchCreateCategories } from "@/lib/categoryOperations"
import type { RouteApiType } from "@/types/api"

// POST /api/categories/batch - Create multiple categories
export async function POST(req: NextRequest): Promise<NextResponse<RouteApiType<Category[]>>> {
  const { titles } = await req.json()
  const result = await batchCreateCategories(titles)
  return NextResponse.json(result)
}
