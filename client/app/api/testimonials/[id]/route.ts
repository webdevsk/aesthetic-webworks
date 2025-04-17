import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { testimonials } from "@/db/schema"
import { eq } from "drizzle-orm"
import { authenticateToken } from "@/server/middleware/auth"

// PUT /api/testimonials/:id - Update a testimonial (no file upload)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateToken(req.headers)
    const { authorName, authorCompany, content } = await req.json()
    // Get the current testimonial
    const [currentTestimonial] = await db.select().from(testimonials).where(eq(testimonials.id, parseInt(params.id)))
    if (!currentTestimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }
    const updateData: any = { authorName, authorCompany, content }
    const [testimonial] = await db
      .update(testimonials)
      .set(updateData)
      .where(eq(testimonials.id, parseInt(params.id)))
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
    return NextResponse.json(formattedTestimonial)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}

// DELETE /api/testimonials/:id - Delete a testimonial (no file deletion)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateToken(req.headers)
    const id = params.id
    const [deletedTestimonial] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
      .returning()
    if (!deletedTestimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
