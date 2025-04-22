import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { testimonials } from "@/db/schema"
import type { RouteApiType } from "@/types/api"
import { authenticateToken } from "@/utils/authenticate-token"
import { uploadToImgbb } from "@/utils/imgbb"
import { DatabaseError } from "@neondatabase/serverless"
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
// GET /api/testimonials - List all testimonials
export async function GET(): Promise<NextResponse<RouteApiType<FormattedTestimonial[]>>> {
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
    return NextResponse.json({ success: true, data: formattedResult })
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error.message)
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to fetch testimonials" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to fetch testimonials" } })
    }
  }
}

// POST /api/testimonials - Create a new testimonial (with image upload)
export async function POST(req: NextRequest): Promise<NextResponse<RouteApiType<FormattedTestimonial>>> {
  try {
    await authenticateToken()
    const formData = await req.formData()

    // Validate fields with zod
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
      return NextResponse.json({ success: false, error: { message: JSON.stringify(parsed.error.flatten()) } })
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

    // Insert testimonial
    const [testimonial] = await db
      .insert(testimonials)
      .values({ authorName, authorCompany, authorImage, content })
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
      return NextResponse.json({ success: false, error: { code: error.code, message: "Failed to create testimonial" } })
    } else {
      console.error(error)
      return NextResponse.json({ success: false, error: { message: "Failed to create testimonial" } })
    }
  }
}
