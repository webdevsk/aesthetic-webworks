import { NextRequest, NextResponse } from "next/server"
import { Project } from "@/db/schema"
import { deleteProject, updateProject } from "@/lib/projectOperations"
import type { RouteApiType } from "@/types/api"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<Project>>> {
  const { id } = await params
  const formData = await req.formData()
  const result = await updateProject(id, formData)
  return NextResponse.json(result)
}

// DELETE /api/projects/:id - Delete a project (no file deletion)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<null>>> {
  const { id } = await params
  const result = await deleteProject(id)
  return NextResponse.json(result)
}
