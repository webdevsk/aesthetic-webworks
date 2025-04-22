import { NextRequest, NextResponse } from "next/server"
import type { Category } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { updateCategory, deleteCategory } from "@/lib/categoryOperations"

// PUT /api/categories/:id - Update a category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<Category>>> {
  const { id } = await params
  const { title } = await req.json()
  const result = await updateCategory(id, title)
  return NextResponse.json(result)
}

// DELETE /api/categories/:id - Delete a category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<null>>> {
  const { id } = await params
  const result = await deleteCategory(id)
  return NextResponse.json(result)
}
