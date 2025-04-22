"server only"

import { db } from "@/db"
import { categories, projectCategories, projects } from "@/db/schema"
import type { Project } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { authenticateToken } from "@/utils/authenticate-token"
import { uploadToImgbb } from "@/utils/imgbb"
import { DatabaseError } from "@neondatabase/serverless"
import { eq, inArray } from "drizzle-orm"
import { z } from "zod"

type ProjectWithCategories = Project & {
  categories: string[]
}

// List all projects with their categories
export const listProjects = async (): Promise<RouteApiType<ProjectWithCategories[]>> => {
  try {
    const projectsList = await db.select().from(projects)
    const projectIds = projectsList.map((p) => p.id)

    const allProjectCategories = await db
      .select({ projectId: projectCategories.projectId, categoryTitle: categories.title })
      .from(projectCategories)
      .innerJoin(categories, eq(categories.id, projectCategories.categoryId))
      .where(
        projectIds.length > 0 ? inArray(projectCategories.projectId, projectIds) : eq(projectCategories.projectId, -1)
      )

    const categoriesByProject = allProjectCategories.reduce(
      (acc, pc) => {
        if (!acc[pc.projectId]) acc[pc.projectId] = []
        acc[pc.projectId].push(pc.categoryTitle)
        return acc
      },
      {} as Record<number, string[]>
    )

    const result = projectsList.map((project) => ({ ...project, categories: categoriesByProject[project.id] || [] }))
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return { success: false, error: { code: error.code, message: "Failed to fetch projects" } }
    }
    console.error(error)
    return { success: false, error: { message: "Failed to fetch projects" } }
  }
}

const ProjectCreateSchema = z.object({
  title: z.string().min(1),
  isLatest: z
    .string()
    .optional()
    .transform((v) => !!v && v === "true"),
  categories: z.string().optional(),
})

// Create a new project
export const createProject = async (formData: FormData): Promise<RouteApiType<Project>> => {
  try {
    await authenticateToken()
    const raw = {
      title: formData.get("title"),
      isLatest: formData.get("isLatest") || undefined,
      categories: formData.get("categories") || undefined,
    }
    const parsed = ProjectCreateSchema.safeParse(raw)
    if (!parsed.success) {
      return { success: false, error: { message: JSON.stringify(parsed.error.flatten()) } }
    }
    const { title, isLatest, categories: categoryTitlesRaw } = parsed.data

    let categoryTitles: string[] = []
    if (typeof categoryTitlesRaw === "string") {
      try {
        categoryTitles = JSON.parse(categoryTitlesRaw)
        if (!Array.isArray(categoryTitles)) categoryTitles = []
      } catch {
        categoryTitles = categoryTitlesRaw
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      }
    }

    let imageUrl: string | undefined
    const file = formData.get("image") as File | null
    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      imageUrl = await uploadToImgbb(buffer, process.env.IMGBB_API_KEY!, file.name)
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-")
    const [project] = await db.insert(projects).values({ title, slug, image: imageUrl, isLatest }).returning()

    if (categoryTitles.length > 0) {
      const existingCategories = await db
        .select()
        .from(categories)
        .where(
          inArray(
            categories.title,
            categoryTitles.map((t: string) => t.trim())
          )
        )

      if (existingCategories.length > 0) {
        await db
          .insert(projectCategories)
          .values(existingCategories.map((category) => ({ projectId: project.id, categoryId: category.id })))
      }
    }

    return { success: true, data: project }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return { success: false, error: { message: error.message || "Failed to create project" } }
    }
    return { success: false, error: { message: "Failed to create project" } }
  }
}

const ProjectUpdateSchema = z.object({
  title: z.string().min(1),
  isLatest: z
    .string()
    .optional()
    .transform((v) => !!v && v === "true"),
  categories: z.string().optional(),
})

// Update an existing project
export const updateProject = async (id: string, formData: FormData): Promise<RouteApiType<Project>> => {
  try {
    await authenticateToken()
    const raw = {
      title: formData.get("title"),
      isLatest: formData.get("isLatest") || undefined,
      categories: formData.get("categories") || undefined,
    }
    const parsed = ProjectUpdateSchema.safeParse(raw)
    if (!parsed.success) {
      return { success: false, error: { message: JSON.stringify(parsed.error.flatten()) } }
    }
    const { title, isLatest, categories: categoryTitlesRaw } = parsed.data

    let categoryTitles: string[] = []
    if (typeof categoryTitlesRaw === "string") {
      try {
        categoryTitles = JSON.parse(categoryTitlesRaw)
      } catch {
        categoryTitles = categoryTitlesRaw.split(",").map((t: string) => t.trim())
      }
    }

    let imageUrl: string | undefined
    const file = formData.get("image") as File | null
    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      imageUrl = await uploadToImgbb(buffer, process.env.IMGBB_API_KEY!, file.name)
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-")
    const [currentProject] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
    if (!currentProject) {
      return { success: false, error: { message: "Project not found" } }
    }

    const updateData: Partial<Project> = { title, slug, isLatest }
    if (imageUrl) updateData.image = imageUrl

    const [project] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, parseInt(id)))
      .returning()

    await db.delete(projectCategories).where(eq(projectCategories.projectId, parseInt(id)))

    if (categoryTitles.length > 0) {
      const existingCategories = await db
        .select()
        .from(categories)
        .where(
          inArray(
            categories.title,
            categoryTitles.map((t: string) => t.trim())
          )
        )

      if (existingCategories.length > 0) {
        await db
          .insert(projectCategories)
          .values(existingCategories.map((category) => ({ projectId: project.id, categoryId: category.id })))
      }
    }

    return { success: true, data: project }
  } catch (error) {
    console.error(error)
    if (error instanceof DatabaseError) {
      return { success: false, error: { code: (error as DatabaseError).code, message: "Failed to update project" } }
    }
    return { success: false, error: { message: "Failed to update project" } }
  }
}

// Delete a project
export const deleteProject = async (id: string): Promise<RouteApiType<null>> => {
  try {
    await authenticateToken()
    await db.delete(projectCategories).where(eq(projectCategories.projectId, parseInt(id)))
    await db.delete(projects).where(eq(projects.id, parseInt(id)))
    return { success: true, data: null }
  } catch (error) {
    console.error(error)
    if (error instanceof DatabaseError) {
      return { success: false, error: { code: (error as DatabaseError).code, message: "Failed to delete project" } }
    }
    return { success: false, error: { message: "Failed to delete project" } }
  }
}
