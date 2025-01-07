import { Router } from "express"
import { db } from "../db"
import { projects, projectCategories } from "../db/schema"
import { eq } from "drizzle-orm"
import { upload, deleteImageFile } from "../utils/upload"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Get all projects
router.get("/", async (_req, res) => {
  try {
    const projectsList = await db.select().from(projects)
    const result = await Promise.all(
      projectsList.map(async (project) => {
        const projectCategoriesResult = await db
          .select({
            categoryTitle: projects.title,
          })
          .from(projects)
          .innerJoin(projectCategories, eq(projects.id, projectCategories.projectId))
          .where(eq(projectCategories.projectId, project.id))

        return {
          ...project,
          categories: projectCategoriesResult.map((pc) => pc.categoryTitle),
        }
      })
    )
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch projects" })
  }
})

// Create a new project
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  let uploadedImagePath: string | undefined

  try {
    const { title, categories: categoryTitles, isLatest } = req.body
    const slug = title.toLowerCase().replace(/\s+/g, "-")
    uploadedImagePath = req.file ? `/uploads/${req.file.filename}` : undefined

    const [project] = await db
      .insert(projects)
      .values({
        title,
        slug,
        image: uploadedImagePath,
        isLatest: isLatest === "true",
      })
      .returning()

    if (categoryTitles) {
      const categoryIds = await Promise.all(
        categoryTitles.split(",").map(async (categoryTitle: string) => {
          const [category] = await db.select().from(projects).where(eq(projects.title, categoryTitle.trim()))
          return category?.id
        })
      )

      await Promise.all(
        categoryIds.filter(Boolean).map((categoryId) =>
          db.insert(projectCategories).values({
            projectId: project.id,
            categoryId: categoryId!,
          })
        )
      )
    }

    res.status(201).json(project)
  } catch (error) {
    // Delete uploaded image if there's an error
    if (uploadedImagePath) {
      await deleteImageFile(uploadedImagePath)
    }
    console.error(error)
    res.status(500).json({ error: "Failed to create project" })
  }
})

// Update a project
router.put("/:id", authenticateToken, upload.single("image"), async (req, res) => {
  let uploadedImagePath: string | undefined

  try {
    const { id } = req.params
    const { title, categories: categoryTitles, isLatest } = req.body
    const slug = title.toLowerCase().replace(/\s+/g, "-")
    uploadedImagePath = req.file ? `/uploads/${req.file.filename}` : undefined

    // Get the current project to get the old image path
    const [currentProject] = await db.select().from(projects).where(eq(projects.id, parseInt(id)))

    const updateData: any = {
      title,
      slug,
      isLatest: isLatest === "true",
    }
    if (uploadedImagePath) {
      updateData.image = uploadedImagePath
    }

    const [project] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, parseInt(id)))
      .returning()

    // If update successful and new image uploaded, delete the old image
    if (uploadedImagePath && currentProject?.image) {
      await deleteImageFile(currentProject.image)
    }

    if (categoryTitles) {
      // Remove existing categories
      await db.delete(projectCategories).where(eq(projectCategories.projectId, parseInt(id)))

      // Add new categories
      const categoryIds = await Promise.all(
        categoryTitles.split(",").map(async (categoryTitle: string) => {
          const [category] = await db.select().from(projects).where(eq(projects.title, categoryTitle.trim()))
          return category?.id
        })
      )

      await Promise.all(
        categoryIds.filter(Boolean).map((categoryId) =>
          db.insert(projectCategories).values({
            projectId: project.id,
            categoryId: categoryId!,
          })
        )
      )
    }

    res.json(project)
  } catch (error) {
    // Delete newly uploaded image if there's an error
    if (uploadedImagePath) {
      await deleteImageFile(uploadedImagePath)
    }
    console.error(error)
    res.status(500).json({ error: "Failed to update project" })
  }
})

// Delete a project
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    // Get the project to get the image path
    const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(id)))

    // Delete associated categories first
    await db.delete(projectCategories).where(eq(projectCategories.projectId, parseInt(id)))

    // Delete the project
    await db.delete(projects).where(eq(projects.id, parseInt(id)))

    // Delete the image file if it exists
    if (project?.image) {
      await deleteImageFile(project.image)
    }

    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to delete project" })
  }
})

export default router 