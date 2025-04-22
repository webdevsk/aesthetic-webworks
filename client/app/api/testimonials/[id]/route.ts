import { NextRequest, NextResponse } from "next/server"
import { Testimonial } from "@/db/schema"
import { deleteTestimonial, updateTestimonial } from "@/lib/testimonialOperations"
import type { RouteApiType } from "@/types/api"

// PUT /api/testimonials/:id - Update a testimonial
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<Testimonial>>> {
  const { id } = await params
  const formData = await req.formData()
  const result = await updateTestimonial(id, formData)
  return NextResponse.json(result)
}

// DELETE /api/testimonials/:id - Delete a testimonial
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RouteApiType<null>>> {
  const { id } = await params
  const result = await deleteTestimonial(id)
  return NextResponse.json(result)
}
