import { z } from "zod"

// Category schemas
export const categorySchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
})

export const categoryListResponseSchema = z.array(categorySchema)

// Project schemas
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  image: z.string().nullable(),
  isLatest: z.boolean(),
  categories: z.array(z.string()).default([]),
})

export const projectListResponseSchema = z.array(projectSchema)

// Testimonial schemas
export const testimonialAuthorSchema = z.object({
  name: z.string(),
  company: z.string().nullable(),
  image: z.string().nullable(),
})

export const testimonialSchema = z.object({
  id: z.string(),
  author: testimonialAuthorSchema,
  content: z.string(),
})

export const testimonialListResponseSchema = z.array(testimonialSchema)

// Error response schema
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  status: z.number(),
  details: z.unknown().optional(),
})

// Generic success response schema
export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.unknown().optional(),
})

// Type exports
export type Category = z.infer<typeof categorySchema>
export type Project = z.infer<typeof projectSchema>
export type TestimonialAuthor = z.infer<typeof testimonialAuthorSchema>
export type Testimonial = z.infer<typeof testimonialSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>
export type SuccessResponse = z.infer<typeof successResponseSchema>
