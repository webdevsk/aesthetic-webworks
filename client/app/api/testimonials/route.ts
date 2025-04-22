import { NextRequest, NextResponse } from "next/server"
import { Testimonial } from "@/db/schema"
import { createTestimonial, listTestimonials } from "@/lib/testimonial-operations"
import type { RouteApiType } from "@/types/api"

// GET /api/testimonials - List all testimonials
export async function GET(): Promise<NextResponse<RouteApiType<Testimonial[]>>> {
  const result = await listTestimonials()
  return NextResponse.json(result)
}

// POST /api/testimonials - Create a new testimonial (with image upload)
export async function POST(req: NextRequest): Promise<NextResponse<RouteApiType<Testimonial>>> {
  const formData = await req.formData()
  const result = await createTestimonial(formData)
  return NextResponse.json(result)
}
