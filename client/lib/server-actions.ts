"use server"

import { revalidatePath } from "next/cache"
import { getAuthHeaders } from "../utils/get-auth-headers"
import { API_URLS } from "./api-urls"
import {
  type Category,
  type Project,
  type Testimonial,
  categorySchema,
  projectSchema,
  testimonialSchema,
} from "./schemas"

export async function createProject(
  formData: FormData
): Promise<{ success: true; data: Project } | { success: false; error: { message: string; code?: string } }> {
  try {
    const headers = await getAuthHeaders(true)
    const response = await fetch(API_URLS.projects.create, { method: "POST", headers, body: formData })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to create project: ${response.statusText}` } }
    }
    const data = await response.json()
    if (data.success) {
      const validatedData = projectSchema.parse(data.data)
      revalidatePath("/admin/projects")
      return { success: true, data: validatedData }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to create project: ${(error as Error).message}` } }
  }
}

export async function updateProject(
  id: number,
  formData: FormData
): Promise<{ success: true; data: Project } | { success: false; error: { message: string; code?: string } }> {
  try {
    const headers = await getAuthHeaders(true)
    const response = await fetch(API_URLS.projects.update(id), { method: "PUT", headers, body: formData })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to update project: ${response.statusText}` } }
    }
    const data = await response.json()
    if (data.success) {
      const validatedData = projectSchema.parse(data.data)
      revalidatePath("/admin/projects")
      return { success: true, data: validatedData }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to update project: ${(error as Error).message}` } }
  }
}

export async function deleteProject(
  id: number
): Promise<{ success: true } | { success: false; error: { message: string; code?: string } }> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.projects.delete(id), { method: "DELETE", headers })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to delete project: ${response.statusText}` } }
    }
    const data = await response.json()
    if (data.success) {
      revalidatePath("/admin/projects")
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to delete project: ${(error as Error).message}` } }
  }
}

export async function createCategory(data: {
  title: string
}): Promise<{ success: true; data: Category } | { success: false; error: { message: string; code?: string } }> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.categories.create, { method: "POST", headers, body: JSON.stringify(data) })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to create category: ${response.statusText}` } }
    }
    const responseData = await response.json()
    if (responseData.success) {
      const validatedData = categorySchema.parse(responseData.data)
      revalidatePath("/admin/categories")
      return { success: true, data: validatedData }
    } else {
      return { success: false, error: responseData.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to create category: ${(error as Error).message}` } }
  }
}

export async function updateCategory(
  id: number,
  data: { title: string }
): Promise<{ success: true; data: Category } | { success: false; error: { message: string; code?: string } }> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.categories.update(id), { method: "PUT", headers, body: JSON.stringify(data) })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to update category: ${response.statusText}` } }
    }
    const responseData = await response.json()
    if (responseData.success) {
      const validatedData = categorySchema.parse(responseData.data)
      revalidatePath("/admin/categories")
      return { success: true, data: validatedData }
    } else {
      return { success: false, error: responseData.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to update category: ${(error as Error).message}` } }
  }
}

export async function deleteCategory(
  id: number
): Promise<{ success: true } | { success: false; error: { message: string; code?: string } }> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.categories.delete(id), { method: "DELETE", headers })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to delete category: ${response.statusText}` } }
    }
    const data = await response.json()
    if (data.success) {
      revalidatePath("/admin/categories")
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to delete category: ${(error as Error).message}` } }
  }
}

export async function createTestimonial(
  formData: FormData
): Promise<{ success: true; data: Testimonial } | { success: false; error: { message: string; code?: string } }> {
  try {
    const headers = await getAuthHeaders(true)
    const response = await fetch(API_URLS.testimonials.create, { method: "POST", headers, body: formData })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to create testimonial: ${response.statusText}` } }
    }
    const data = await response.json()
    if (data.success) {
      const validatedData = testimonialSchema.parse(data.data)
      revalidatePath("/admin/testimonials")
      return { success: true, data: validatedData }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to create testimonial: ${(error as Error).message}` } }
  }
}

export async function updateTestimonial(
  id: number,
  formData: FormData
): Promise<{ success: true; data: Testimonial } | { success: false; error: { message: string; code?: string } }> {
  try {
    const headers = await getAuthHeaders(true)
    const response = await fetch(API_URLS.testimonials.update(id), { method: "PUT", headers, body: formData })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to update testimonial: ${response.statusText}` } }
    }
    const data = await response.json()
    if (data.success) {
      const validatedData = testimonialSchema.parse(data.data)
      revalidatePath("/admin/testimonials")
      return { success: true, data: validatedData }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to update testimonial: ${(error as Error).message}` } }
  }
}

export async function deleteTestimonial(
  id: number
): Promise<{ success: true } | { success: false; error: { message: string; code?: string } }> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.testimonials.delete(id), { method: "DELETE", headers })
    if (!response.ok) {
      return { success: false, error: { message: `Failed to delete testimonial: ${response.statusText}` } }
    }
    const data = await response.json()
    if (data.success) {
      revalidatePath("/admin/testimonials")
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: { message: `Failed to delete testimonial: ${(error as Error).message}` } }
  }
}
