"server only"

import { db } from "@/db"
import { testimonials } from "@/db/schema"
import type { Testimonial } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { authenticateToken } from "@/utils/authenticate-token"
import { uploadToImgbb } from "@/utils/imgbb"
import { DatabaseError } from "@neondatabase/serverless"
import { eq } from "drizzle-orm"
import { z } from "zod"

// List all testimonials
export const listTestimonials = async (): Promise<RouteApiType<Testimonial[]>> => {
  try {
    const result = await db.select().from(testimonials)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return { success: false, error: { code: error.code, message: "Failed to fetch testimonials" } }
    }
    console.error(error)
    return { success: false, error: { message: "Failed to fetch testimonials" } }
  }
}

// Create a new testimonial
export const createTestimonial = async (formData: FormData): Promise<RouteApiType<Testimonial>> => {
  try {
    await authenticateToken()
    const TestimonialCreateSchema = z.object({
      authorName: z.string().min(1),
      authorCompany: z.string().min(1),
      content: z.string().min(1),
    })
    const raw = {
      authorName: formData.get("authorName"),
      authorCompany: formData.get("authorCompany"),
      content: formData.get("content"),
    }
    const parsed = TestimonialCreateSchema.safeParse(raw)
    if (!parsed.success) {
      return { success: false, error: { message: JSON.stringify(parsed.error.flatten()) } }
    }
    const { authorName, authorCompany, content } = parsed.data
    let authorImage: string | undefined
    const file = formData.get("authorImage") as File | null
    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      authorImage = await uploadToImgbb(buffer, process.env.IMGBB_API_KEY!, file.name)
    }
    const [testimonial] = await db
      .insert(testimonials)
      .values({ authorName, authorCompany, authorImage, content })
      .returning()
    return { success: true, data: testimonial }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return { success: false, error: { code: error.code, message: "Failed to create testimonial" } }
    }
    console.error(error)
    return { success: false, error: { message: "Failed to create testimonial" } }
  }
}

// Update a testimonial
export const updateTestimonial = async (id: string, formData: FormData): Promise<RouteApiType<Testimonial>> => {
  try {
    await authenticateToken()
    const TestimonialUpdateSchema = z.object({
      authorName: z.string().min(1),
      authorCompany: z.string().min(1),
      content: z.string().min(1),
    })
    const raw = {
      authorName: formData.get("authorName"),
      authorCompany: formData.get("authorCompany"),
      content: formData.get("content"),
    }
    const parsed = TestimonialUpdateSchema.safeParse(raw)
    if (!parsed.success) {
      return { success: false, error: { message: JSON.stringify(parsed.error.flatten()) } }
    }
    const { authorName, authorCompany, content } = parsed.data
    let authorImage: string | undefined
    const file = formData.get("authorImage") as File | null
    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      authorImage = await uploadToImgbb(buffer, process.env.IMGBB_API_KEY!, file.name)
    }
    const [currentTestimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
    if (!currentTestimonial) {
      return { success: false, error: { message: "Testimonial not found" } }
    }
    const updateData: Partial<Testimonial> = { authorName, authorCompany, content }
    if (authorImage) {
      updateData.authorImage = authorImage
    }
    const [testimonial] = await db
      .update(testimonials)
      .set(updateData)
      .where(eq(testimonials.id, parseInt(id)))
      .returning()
    return { success: true, data: testimonial }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return { success: false, error: { code: error.code, message: "Failed to update testimonial" } }
    }
    console.error(error)
    return { success: false, error: { message: "Failed to update testimonial" } }
  }
}

// Delete a testimonial
export const deleteTestimonial = async (id: string): Promise<RouteApiType<null>> => {
  try {
    await authenticateToken()
    const [deletedTestimonial] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
      .returning()
    if (!deletedTestimonial) {
      return { success: false, error: { message: "Testimonial not found" } }
    }
    return { success: true, data: null }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return { success: false, error: { code: error.code, message: "Failed to delete testimonial" } }
    }
    console.error(error)
    return { success: false, error: { message: "Failed to delete testimonial" } }
  }
}
