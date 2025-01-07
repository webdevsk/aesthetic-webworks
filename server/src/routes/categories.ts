import { Router } from "express"
import { db } from "../db"
import { categories } from "../db/schema"
import { eq } from "drizzle-orm"
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

    const [category] = await db.insert(categories).values({ title, slug }).returning()

    res.status(201).json(category)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create category" })
  }
})

// Update a category
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title } = req.body
    const slug = title.toLowerCase().replace(/\s+/g, "-")

    const [category] = await db
      .update(categories)
      .set({ title, slug })
      .where(eq(categories.id, parseInt(id)))
      .returning()

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
    await db.delete(categories).where(eq(categories.id, parseInt(id)))
    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to delete category" })
  }
})

export default router 