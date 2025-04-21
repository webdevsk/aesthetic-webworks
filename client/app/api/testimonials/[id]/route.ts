import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { Testimonial, testimonials } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { authenticateToken } from "@/utils/authenticate-token"
import { uploadToImgbb } from "@/utils/imgbb"
import { DatabaseError } from "@neondatabase/serverless"
import { eq } from "drizzle-orm"
import { z } from "zod"

type FormattedTestimonial = {
  id: string
  author: {
    name: string
    company: string | null
    image: string | null
  }
  content: string
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<FormattedTestimonial>>> {
  try {
    const { id } = await params
    await authenticateToken(req.headers)
    const formData = await req.formData()

    // Validate fields with zod
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
      console.error(parsed.error.flatten())
      return NextResponse.json({
        success: false,
        error: {
          message: JSON.stringify(parsed.error.flatten()),
        },
      })
    }
    const { authorName, authorCompany, content } = parsed.data

    // Handle image upload
    let authorImage: string | undefined
    const file = formData.get("authorImage") as File | null
    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      authorImage = await uploadToImgbb(buffer, process.env.IMGBB_API_KEY!, file.name)
    }

    // Get the current testimonial
    const [currentTestimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
    if (!currentTestimonial) {
      return NextResponse.json({ success: false, error: { message: "Testimonial not found" } })
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
    const formattedTestimonial = {
      id: testimonial.id.toString(),
      author: {
        name: testimonial.authorName,
        company: testimonial.authorCompany,
        image: testimonial.authorImage,
      },
      content: testimonial.content,
    }
    return NextResponse.json({ success: true, data: formattedTestimonial })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to update testimonial" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to update testimonial" } })
    }
  }
}

// DELETE /api/testimonials/:id - Delete a testimonial (no file deletion)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<null>>> {
  try {
    const { id } = await params
    await authenticateToken(req.headers)
    const [deletedTestimonial] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
      .returning()
    if (!deletedTestimonial) {
      return NextResponse.json({ success: false, error: { message: "Testimonial not found" } })
    }
    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to delete testimonial" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to delete testimonial" } })
    }
  }
}
