import { NextRequest, NextResponse } from "next/server"
import { Project } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { listProjects, createProject } from "@/lib/projectOperations"

// GET /api/projects - List all projects with categories
export async function GET(): Promise<NextResponse<RouteApiType<Array<Project & { categories: string[] }>>>> {
  const result = await listProjects()
  return NextResponse.json(result)
}

// POST /api/projects - Create a new project (with file upload)
export async function POST(req: NextRequest): Promise<NextResponse<RouteApiType<Project>>> {
  const formData = await req.formData()
  const result = await createProject(formData)
  return NextResponse.json(result)
}
