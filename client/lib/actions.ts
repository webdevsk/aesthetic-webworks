"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { API_URLS } from "./api-urls"
import {
  type Category,
  type ErrorResponse,
  type Project,
  type Testimonial,
  categoryListResponseSchema,
  categorySchema,
  errorResponseSchema,
  projectListResponseSchema,
  projectSchema,
  successResponseSchema,
  testimonialListResponseSchema,
  testimonialSchema,
} from "./schemas"

const handleApiError = (error: any, operation: string): ErrorResponse => {
  console.error(`Error in ${operation}:`, error)

  // Handle API response errors
  if (error instanceof Response) {
    return errorResponseSchema.parse({
      success: false,
      error: `Failed to ${operation}`,
      status: error.status,
      details: error.statusText,
    })
  }

  // Handle Zod validation errors
  if (error.name === "ZodError") {
    return errorResponseSchema.parse({
      success: false,
      error: `Invalid response format for ${operation}`,
      status: 422,
      details: error.errors,
    })
  }

  // Handle authentication errors
  if (error.message === "Authentication required") {
    return errorResponseSchema.parse({
      success: false,
      error: "Authentication required",
      status: 401,
      details: "Please log in to continue",
    })
  }

  // Handle all other errors
  return errorResponseSchema.parse({
    success: false,
    error: `Failed to ${operation}`,
    status: 500,
    details: error.message || "An unexpected error occurred",
  })
}

const getAuthHeaders = async (isMultipart = false) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    throw new Error("Authentication required")
  }

  return {
    Authorization: `Bearer ${token}`,
    ...(isMultipart ? {} : { "Content-Type": "application/json" }),
  }
}

export async function getProjects(): Promise<{ success: true; data: Project[] } | ErrorResponse> {
  try {
    const response = await fetch(API_URLS.projects.list, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    const data = await response.json()
    const validatedData = projectListResponseSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    return handleApiError(error, "fetch projects")
  }
}

export async function createProject(formData: FormData): Promise<{ success: true; data: Project } | ErrorResponse> {
  try {
    const headers = await getAuthHeaders(true)

    const response = await fetch(API_URLS.projects.create, {
      method: "POST",
      headers,
      body: formData, // Send FormData directly
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    const data = await response.json()
    const validatedData = projectSchema.parse(data)
    revalidatePath("/admin/projects")
    return { success: true, data: validatedData }
  } catch (error) {
    return handleApiError(error, "create project")
  }
}

export async function updateProject(
  id: number,
  formData: FormData
): Promise<{ success: true; data: Project } | ErrorResponse> {
  try {
    const headers = await getAuthHeaders(true)

    const response = await fetch(API_URLS.projects.update(id), {
      method: "PUT",
      headers,
      body: formData, // Send FormData directly
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    const data = await response.json()
    const validatedData = projectSchema.parse(data)
    revalidatePath("/admin/projects")
    return { success: true, data: validatedData }
  } catch (error) {
    return handleApiError(error, "update project")
  }
}

export async function deleteProject(id: number): Promise<{ success: true } | ErrorResponse> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.projects.delete(id), {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    revalidatePath("/admin/projects")
    return successResponseSchema.parse({ success: true })
  } catch (error) {
    return handleApiError(error, "delete project")
  }
}

export async function getCategories(): Promise<{ success: true; data: Category[] } | ErrorResponse> {
  try {
    const response = await fetch(API_URLS.categories.list, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    const data = await response.json()
    const validatedData = categoryListResponseSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    return handleApiError(error, "fetch categories")
  }
}

export async function createCategory(data: {
  title: string
}): Promise<{ success: true; data: Category } | ErrorResponse> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.categories.create, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    const responseData = await response.json()
    const validatedData = categorySchema.parse(responseData)
    revalidatePath("/admin/categories")
    return { success: true, data: validatedData }
  } catch (error) {
    return handleApiError(error, "create category")
  }
}

export async function updateCategory(
  id: number,
  data: { title: string }
): Promise<{ success: true; data: Category } | ErrorResponse> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.categories.update(id), {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    const responseData = await response.json()
    const validatedData = categorySchema.parse(responseData)
    revalidatePath("/admin/categories")
    return { success: true, data: validatedData }
  } catch (error) {
    return handleApiError(error, "update category")
  }
}

export async function deleteCategory(id: number): Promise<{ success: true } | ErrorResponse> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.categories.delete(id), {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    revalidatePath("/admin/categories")
    return successResponseSchema.parse({ success: true })
  } catch (error) {
    return handleApiError(error, "delete category")
  }
}

export async function getTestimonials(): Promise<{ success: true; data: Testimonial[] } | ErrorResponse> {
  try {
    const response = await fetch(API_URLS.testimonials.list, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    const data = await response.json()
    const validatedData = testimonialListResponseSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    return handleApiError(error, "fetch testimonials")
  }
}

export async function createTestimonial(
  formData: FormData
): Promise<{ success: true; data: Testimonial } | ErrorResponse> {
  try {
    const headers = await getAuthHeaders(true)

    const response = await fetch(API_URLS.testimonials.create, {
      method: "POST",
      headers,
      body: formData, // Send FormData directly
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    const data = await response.json()
    const validatedData = testimonialSchema.parse(data)
    revalidatePath("/admin/testimonials")
    return { success: true, data: validatedData }
  } catch (error) {
    return handleApiError(error, "create testimonial")
  }
}

export async function updateTestimonial(
  id: number,
  formData: FormData
): Promise<{ success: true; data: Testimonial } | ErrorResponse> {
  try {
    const headers = await getAuthHeaders(true)

    const response = await fetch(API_URLS.testimonials.update(id), {
      method: "PUT",
      headers,
      body: formData, // Send FormData directly
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    const data = await response.json()
    const validatedData = testimonialSchema.parse(data)
    revalidatePath("/admin/testimonials")
    return { success: true, data: validatedData }
  } catch (error) {
    return handleApiError(error, "update testimonial")
  }
}

export async function deleteTestimonial(id: number): Promise<{ success: true } | ErrorResponse> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.testimonials.delete(id), {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw Object.assign(response, { details: errorData })
    }

    revalidatePath("/admin/testimonials")
    return successResponseSchema.parse({ success: true })
  } catch (error) {
    return handleApiError(error, "delete testimonial")
  }
}
