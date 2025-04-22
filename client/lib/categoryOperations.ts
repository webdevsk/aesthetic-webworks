import { db } from "@/db"
import { categories } from "@/db/schema"
import type { Category } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { authenticateToken } from "@/utils/authenticate-token"
import { DatabaseError } from "@neondatabase/serverless"
import { eq, inArray } from "drizzle-orm"

// Get all categories
export const listCategories = async (): Promise<RouteApiType<Category[]>> => {
  try {
    const result = await db.select().from(categories)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return { success: false, error: { code: error.code, message: "Failed to fetch categories" } }
    }
    console.error(error)
    return { success: false, error: { message: "Failed to fetch categories" } }
  }
}

// Create a new category
export const createCategory = async (title: string): Promise<RouteApiType<Category>> => {
  try {
    await authenticateToken()
    const slug = title.toLowerCase().replace(/\s+/g, "-")
    // Check if category already exists
    const existingCategory = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.title, title))
      .limit(1)
    if (existingCategory.length > 0) {
      return { success: false, error: { message: "Category already exists" } }
    }
    const [category] = await db.insert(categories).values({ title, slug }).returning()
    return { success: true, data: category }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return { success: false, error: { code: error.code, message: "Failed to create category" } }
    }
    console.error(error)
    return { success: false, error: { message: "Failed to create category" } }
  }
}

// Update a category
export const updateCategory = async (id: string, title: string): Promise<RouteApiType<Category>> => {
  try {
    await authenticateToken()
    const slug = title.toLowerCase().replace(/\s+/g, "-")
    // Check if new title already exists for a different category
    const existingCategory = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.title, title))
      .limit(1)
    if (existingCategory.length > 0 && existingCategory[0].id !== parseInt(id)) {
      return { success: false, error: { message: "Category with this title already exists" } }
    }
    const [category] = await db
      .update(categories)
      .set({ title, slug })
      .where(eq(categories.id, parseInt(id)))
      .returning()
    if (!category) {
      return { success: false, error: { message: "Category not found" } }
    }
    return { success: true, data: category }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return { success: false, error: { code: error.code, message: "Failed to update category" } }
    }
    console.error(error)
    return { success: false, error: { message: "Failed to update category" } }
  }
}

// Delete a category
export const deleteCategory = async (id: string): Promise<RouteApiType<null>> => {
  try {
    await authenticateToken()
    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, parseInt(id)))
      .returning()
    if (!deletedCategory) {
      return { success: false, error: { message: "Category not found" } }
    }
    return { success: true, data: null }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      if (error.code === "23503" && error.constraint === "project_categories_category_id_categories_id_fk") {
        return {
          success: false,
          error: {
            code: error.code,
            message:
              "Cannot delete this category as it is being used by one or more projects. Please remove it from all projects first.",
          },
        }
      }
      return { success: false, error: { code: error.code, message: "Failed to delete category" } }
    }
    console.error(error)
    return { success: false, error: { message: "Failed to delete category" } }
  }
}

// Batch create categories
export const batchCreateCategories = async (titles: string[]): Promise<RouteApiType<Category[]>> => {
  try {
    await authenticateToken()
    if (!Array.isArray(titles)) {
      return { success: false, error: { message: "titles must be an array" } }
    }
    const uniqueTitles = [...new Set(titles)]
    const existingCategories = await db
      .select({ title: categories.title })
      .from(categories)
      .where(inArray(categories.title, uniqueTitles))
    const existingTitles = new Set(existingCategories.map((c) => c.title))
    const newTitles = uniqueTitles.filter((title) => !existingTitles.has(title))
    if (newTitles.length === 0) {
      return { success: true, data: [] }
    }
    const newCategories = await db
      .insert(categories)
      .values(
        newTitles.map((title) => ({
          title,
          slug: title.toLowerCase().replace(/\s+/g, "-"),
        }))
      )
      .returning()
    return { success: true, data: newCategories }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return { success: false, error: { code: error.code, message: "Failed to create categories" } }
    }
    console.error(error)
    return { success: false, error: { message: "Failed to create categories" } }
  }
}
