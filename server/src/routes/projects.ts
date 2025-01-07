import { Router } from "express"
import { db } from "../db"
import { projects, projectCategories, categories } from "../db/schema"
import { eq, inArray } from "drizzle-orm"
import { upload, deleteImageFile } from "../utils/upload"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Get all projects
router.get("/", async (_req, res) => {
  try {
    const projectsList = await db.select().from(projects)
    const projectIds = projectsList.map((p) => p.id)

    // Fetch all categories for all projects in a single query
    const allProjectCategories = await db
      .select({
        projectId: projectCategories.projectId,
        categoryTitle: categories.title,
      })
      .from(projectCategories)
      .innerJoin(categories, eq(categories.id, projectCategories.categoryId))
      .where(inArray(projectCategories.projectId, projectIds))

    // Group categories by project
    const categoriesByProject = allProjectCategories.reduce((acc, pc) => {
      if (!acc[pc.projectId]) {
        acc[pc.projectId] = []
      }
      acc[pc.projectId].push(pc.categoryTitle)
      return acc
    }, {} as Record<number, string[]>)

    // Map projects with their categories
    const result = projectsList.map((project) => ({
      ...project,
      categories: categoriesByProject[project.id] || [],
    }))

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
      const categoryTitlesArray = Array.isArray(categoryTitles) ? categoryTitles : [categoryTitles]

      // Get all categories in a single query
      const existingCategories = await db
        .select()
        .from(categories)
        .where(inArray(categories.title, categoryTitlesArray.map((t) => t.trim())))

      // Create project-category relationships
      if (existingCategories.length > 0) {
        await db.insert(projectCategories).values(
          existingCategories.map((category) => ({
            projectId: project.id,
            categoryId: category.id,
          }))
        )
      }

      // Return project with categories
      const projectCategoriesResult = await db
        .select({
          categoryTitle: categories.title,
        })
        .from(projectCategories)
        .innerJoin(categories, eq(categories.id, projectCategories.categoryId))
        .where(eq(projectCategories.projectId, project.id))

      return res.status(201).json({
        ...project,
        categories: projectCategoriesResult.map((pc) => pc.categoryTitle),
      })
    }

    res.status(201).json({ ...project, categories: [] })
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

    // Get the current project to get the old image path
    const [currentProject] = await db.select().from(projects).where(eq(projects.id, parseInt(id)))
    if (!currentProject) {
      return res.status(404).json({ error: "Project not found" })
    }

    // Only set new image path if a file was uploaded
    uploadedImagePath = req.file ? `/uploads/${req.file.filename}` : undefined

    const updateData: any = {
      title,
      slug,
      isLatest: isLatest === "true",
    }

    // Only update image if a new one was uploaded
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

      const categoryTitlesArray = Array.isArray(categoryTitles) ? categoryTitles : [categoryTitles]

      // Get all categories in a single query
      const existingCategories = await db
        .select()
        .from(categories)
        .where(inArray(categories.title, categoryTitlesArray.map((t) => t.trim())))

      // Create project-category relationships
      if (existingCategories.length > 0) {
        await db.insert(projectCategories).values(
          existingCategories.map((category) => ({
            projectId: project.id,
            categoryId: category.id,
          }))
        )
      }

      // Return project with categories
      const projectCategoriesResult = await db
        .select({
          categoryTitle: categories.title,
        })
        .from(projectCategories)
        .innerJoin(categories, eq(categories.id, projectCategories.categoryId))
        .where(eq(projectCategories.projectId, project.id))

      return res.json({
        ...project,
        categories: projectCategoriesResult.map((pc) => pc.categoryTitle),
      })
    }

    res.json({ ...project, categories: [] })
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