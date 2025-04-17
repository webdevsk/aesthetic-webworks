import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { testimonials } from "@/db/schema"

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
