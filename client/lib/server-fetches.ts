import { API_URLS } from "./api-urls"
import {
  type Category,
  type Project,
  type Testimonial,
  categoryListResponseSchema,
  projectListResponseSchema,
  testimonialListResponseSchema,
} from "./schemas"

export async function getProjects(): Promise<
  { success: true; data: Project[] } | { success: false; error: { message: string; code?: string } }
> {
  try {
    const response = await fetch(API_URLS.projects.list, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to fetch projects: ${response.statusText}` } }
    }
    const data = await response.json()
    if (data.success) {
      // Validate shape
      const validatedData = projectListResponseSchema.parse(data.data)
      return { success: true, data: validatedData }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to fetch projects: ${(error as Error).message}` } }
  }
}

export async function getCategories(): Promise<
  { success: true; data: Category[] } | { success: false; error: { message: string; code?: string } }
> {
  try {
    const response = await fetch(API_URLS.categories.list, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to fetch categories: ${response.statusText}` } }
    }
    const data = await response.json()
    if (data.success) {
      const validatedData = categoryListResponseSchema.parse(data.data)
      return { success: true, data: validatedData }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to fetch categories: ${(error as Error).message}` } }
  }
}

export async function getTestimonials(): Promise<
  { success: true; data: Testimonial[] } | { success: false; error: { message: string; code?: string } }
> {
  try {
    const response = await fetch(API_URLS.testimonials.list, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to fetch testimonials: ${response.statusText}` } }
    }
    const data = await response.json()
    if (data.success) {
      const validatedData = testimonialListResponseSchema.parse(data.data)
      return { success: true, data: validatedData }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to fetch testimonials: ${(error as Error).message}` } }
  }
}
