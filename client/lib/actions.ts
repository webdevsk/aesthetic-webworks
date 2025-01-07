"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { API_URLS } from "./api-urls"

export interface Project {
  id: number
  title: string
  slug: string
  image?: string
  isLatest: boolean
  categories: string[]
}

export interface Category {
  id: number
  title: string
  slug: string
}

export interface Testimonial {
  id: string
  author: {
    name: string
    company?: string
    image?: string
  }
  content: string
}

interface ApiError {
  error: string
  status: number
  details?: any
}

const handleApiError = (error: any, operation: string): ApiError => {
  console.error(`Error in ${operation}:`, error)
  if (error instanceof Response) {
    return {
      error: `Failed to ${operation}`,
      status: error.status,
      details: error.statusText,
    }
  }
  return {
    error: `Failed to ${operation}`,
    status: 500,
    details: error.message,
  }
}

const getAuthHeaders = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) {
    throw new Error("Authentication required")
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

export async function getProjects() {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.projects.list, {
      headers,
      cache: "no-store",
    })
    if (!response.ok) throw response
    const data = await response.json()
    return { data }
  } catch (error) {
    return handleApiError(error, "fetch projects")
  }
}

export async function createProject(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) throw new Error("Authentication required")

    const response = await fetch(API_URLS.projects.create, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!response.ok) throw response
    const data = await response.json()
    revalidatePath("/admin/projects")
    return { data }
  } catch (error) {
    return handleApiError(error, "create project")
  }
}

export async function updateProject(id: number, formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) throw new Error("Authentication required")

    const response = await fetch(API_URLS.projects.update(id), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!response.ok) throw response
    const data = await response.json()
    revalidatePath("/admin/projects")
    return { data }
  } catch (error) {
    return handleApiError(error, "update project")
  }
}

export async function deleteProject(id: number) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.projects.delete(id), {
      method: "DELETE",
      headers,
    })
    if (!response.ok) throw response
    revalidatePath("/admin/projects")
    return { success: true }
  } catch (error) {
    return handleApiError(error, "delete project")
  }
}

export async function getCategories() {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.categories.list, {
      headers,
      cache: "no-store",
    })
    if (!response.ok) throw response
    const data = await response.json()
    return { data }
  } catch (error) {
    return handleApiError(error, "fetch categories")
  }
}

export async function createCategory(data: { title: string }) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.categories.create, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })
    if (!response.ok) throw response
    const responseData = await response.json()
    revalidatePath("/admin/categories")
    return { data: responseData }
  } catch (error) {
    return handleApiError(error, "create category")
  }
}

export async function updateCategory(id: number, data: { title: string }) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.categories.update(id), {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    })
    if (!response.ok) throw response
    const responseData = await response.json()
    revalidatePath("/admin/categories")
    return { data: responseData }
  } catch (error) {
    return handleApiError(error, "update category")
  }
}

export async function deleteCategory(id: number) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.categories.delete(id), {
      method: "DELETE",
      headers,
    })
    if (!response.ok) throw response
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    return handleApiError(error, "delete category")
  }
}

export async function getTestimonials() {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.testimonials.list, {
      headers,
      cache: "no-store",
    })
    if (!response.ok) throw response
    const data = await response.json()
    return { data }
  } catch (error) {
    return handleApiError(error, "fetch testimonials")
  }
}

export async function createTestimonial(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) throw new Error("Authentication required")

    const response = await fetch(API_URLS.testimonials.create, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!response.ok) throw response
    const data = await response.json()
    revalidatePath("/admin/testimonials")
    return { data }
  } catch (error) {
    return handleApiError(error, "create testimonial")
  }
}

export async function updateTestimonial(id: number, formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) throw new Error("Authentication required")

    const response = await fetch(API_URLS.testimonials.update(id), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!response.ok) throw response
    const data = await response.json()
    revalidatePath("/admin/testimonials")
    return { data }
  } catch (error) {
    return handleApiError(error, "update testimonial")
  }
}

export async function deleteTestimonial(id: number) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(API_URLS.testimonials.delete(id), {
      method: "DELETE",
      headers,
    })
    if (!response.ok) throw response
    revalidatePath("/admin/testimonials")
    return { success: true }
  } catch (error) {
    return handleApiError(error, "delete testimonial")
  }
}
