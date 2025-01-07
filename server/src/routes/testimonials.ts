import { Router } from "express"
import { db } from "../db"
import { testimonials } from "../db/schema"
import { eq } from "drizzle-orm"
import { upload, deleteImageFile } from "../utils/upload"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Get all testimonials
router.get("/", async (_req, res) => {
  try {
    const result = await db.select().from(testimonials)
    const formattedResult = result.map((testimonial) => ({
      id: testimonial.id.toString(),
      author: {
        name: testimonial.authorName,
        company: testimonial.authorCompany,
        image: testimonial.authorImage,
      },
      content: testimonial.content,
    }))
    res.json(formattedResult)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch testimonials" })
  }
})

// Create a new testimonial
router.post("/", authenticateToken, upload.single("authorImage"), async (req, res) => {
  let uploadedImagePath: string | undefined

  try {
    const { authorName, authorCompany, content } = req.body
    uploadedImagePath = req.file ? `/uploads/${req.file.filename}` : undefined

    const [testimonial] = await db
      .insert(testimonials)
      .values({
        authorName,
        authorCompany,
        authorImage: uploadedImagePath,
        content,
      })
      .returning()

    // Format response to match client-side type
    const formattedTestimonial = {
      id: testimonial.id.toString(),
      author: {
        name: testimonial.authorName,
        company: testimonial.authorCompany,
        image: testimonial.authorImage,
      },
      content: testimonial.content,
    }

    res.status(201).json(formattedTestimonial)
  } catch (error) {
    // Delete uploaded image if there's an error
    if (uploadedImagePath) {
      await deleteImageFile(uploadedImagePath)
    }
    console.error(error)
    res.status(500).json({ error: "Failed to create testimonial" })
  }
})

// Update a testimonial
router.put("/:id", authenticateToken, upload.single("authorImage"), async (req, res) => {
  let uploadedImagePath: string | undefined

  try {
    const { id } = req.params
    const { authorName, authorCompany, content } = req.body
    uploadedImagePath = req.file ? `/uploads/${req.file.filename}` : undefined

    // Get the current testimonial to get the old image path
    const [currentTestimonial] = await db.select().from(testimonials).where(eq(testimonials.id, parseInt(id)))

    const updateData: any = {
      authorName,
      authorCompany,
      content,
    }
    if (uploadedImagePath) {
      updateData.authorImage = uploadedImagePath
    }

    const [testimonial] = await db
      .update(testimonials)
      .set(updateData)
      .where(eq(testimonials.id, parseInt(id)))
      .returning()

    // If update successful and new image uploaded, delete the old image
    if (uploadedImagePath && currentTestimonial?.authorImage) {
      await deleteImageFile(currentTestimonial.authorImage)
    }

    // Format response to match client-side type
    const formattedTestimonial = {
      id: testimonial.id.toString(),
      author: {
        name: testimonial.authorName,
        company: testimonial.authorCompany,
        image: testimonial.authorImage,
      },
      content: testimonial.content,
    }

    res.json(formattedTestimonial)
  } catch (error) {
    // Delete newly uploaded image if there's an error
    if (uploadedImagePath) {
      await deleteImageFile(uploadedImagePath)
    }
    console.error(error)
    res.status(500).json({ error: "Failed to update testimonial" })
  }
})

// Delete a testimonial
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    // Get the testimonial to get the image path
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, parseInt(id)))

    // Delete the testimonial
    await db.delete(testimonials).where(eq(testimonials.id, parseInt(id)))

    // Delete the image file if it exists
    if (testimonial?.authorImage) {
      await deleteImageFile(testimonial.authorImage)
    }

    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to delete testimonial" })
  }
})

export default router 