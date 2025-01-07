import { Router } from "express"
import { db } from "../db"
import { categories } from "../db/schema"
import { eq, inArray } from "drizzle-orm"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Get all categories
router.get("/", async (_req, res) => {
  try {
    const result = await db.select().from(categories)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

// Create a new category
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title } = req.body
    const slug = title.toLowerCase().replace(/\s+/g, "-")

    // Check if category already exists
    const existingCategory = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.title, title))
      .limit(1)

    if (existingCategory.length > 0) {
      return res.status(400).json({ error: "Category already exists" })
    }

    const [category] = await db.insert(categories).values({ title, slug }).returning()
    res.status(201).json(category)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create category" })
  }
})

// Create multiple categories
router.post("/batch", authenticateToken, async (req, res) => {
  try {
    const { titles } = req.body
    if (!Array.isArray(titles)) {
      return res.status(400).json({ error: "titles must be an array" })
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
      return res.status(200).json({ message: "No new categories to create" })
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

    res.status(201).json(newCategories)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create categories" })
  }
})

// Update a category
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title } = req.body
    const slug = title.toLowerCase().replace(/\s+/g, "-")

    // Check if new title already exists for a different category
    const existingCategory = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.title, title))
      .limit(1)

    if (existingCategory.length > 0 && existingCategory[0].id !== parseInt(id)) {
      return res.status(400).json({ error: "Category with this title already exists" })
    }

    const [category] = await db
      .update(categories)
      .set({ title, slug })
      .where(eq(categories.id, parseInt(id)))
      .returning()

    if (!category) {
      return res.status(404).json({ error: "Category not found" })
    }

    res.json(category)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to update category" })
  }
})

// Delete a category
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, parseInt(id)))
      .returning()

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" })
    }

    res.status(204).end()
  } catch (error: any) {
    console.error(error)
    // Check for foreign key constraint violation
    if (error.code === "23503" && error.constraint === "project_categories_category_id_categories_id_fk") {
      return res.status(400).json({
        error: "Cannot delete this category as it is being used by one or more projects. Please remove it from all projects first.",
      })
    }
    res.status(500).json({ error: "Failed to delete category" })
  }
})

export default router 