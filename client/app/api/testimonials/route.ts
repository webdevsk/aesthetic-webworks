import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { testimonials } from "@/db/schema"
import { authenticateToken } from "@/server/middleware/auth"
import { uploadToImgbb } from "@/utils/imgbb"
import { z } from "zod"

// GET /api/testimonials - List all testimonials
export async function GET() {
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
    return NextResponse.json(formattedResult)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

// POST /api/testimonials - Create a new testimonial (with image upload)
export async function POST(req: NextRequest) {
  try {
    await authenticateToken(req.headers)
    const formData = await req.formData()

    // Validate fields with zod
    const TestimonialCreateSchema = z.object({
      authorName: z.string().min(1),
      authorCompany: z.string().min(1),
      content: z.string().min(1),
    })
    const raw = {
      authorName: formData.get('authorName'),
      authorCompany: formData.get('authorCompany'),
      content: formData.get('content'),
    }
    const parsed = TestimonialCreateSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { authorName, authorCompany, content } = parsed.data

    // Handle image upload
    let authorImage: string | undefined
    const file = formData.get('authorImage') as File | null
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
    return NextResponse.json(formattedTestimonial)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}
