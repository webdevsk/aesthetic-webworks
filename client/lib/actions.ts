import { API_URLS } from "./api-urls"
import {
  type Category,
  type Project,
  type Testimonial,
  apiSchema,
  categoryListResponseSchema,
  categorySchema,
  projectListResponseSchema,
  projectSchema,
  testimonialListResponseSchema,
  testimonialSchema,
} from "./schemas"
import { z } from "zod"

type FlattenResponseType<T> = { success: true; data: T } | { success: false; error: string }

export async function getProjects(): Promise<FlattenResponseType<Project[]>> {
  const response = await fetch(API_URLS.projects.list, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok) {
    return { success: false, error: `Failed to fetch projects: ${response.statusText}` }
  }
  const validated = apiSchema(projectListResponseSchema).safeParse(await response.json())
  if (!validated.success) {
    console.error(`Response validation failed: ${validated.error.message}`)
    return { success: false, error: `Response validation failed: ${validated.error.message}` }
  }
  return validated.data.success
    ? { success: true, data: validated.data.data }
    : { success: false, error: validated.data.error.message }
}

export async function createProject(formData: FormData): Promise<FlattenResponseType<Project>> {
  const response = await fetch(API_URLS.projects.create, {
    method: "POST",
    body: formData,
  })
  if (response.ok) {
    const validated = apiSchema(projectSchema).safeParse(await response.json())
    if (!validated.success) {
      console.error(`Response validation failed: ${validated.error.message}`)
      return { success: false, error: `Response validation failed: ${validated.error.message}` }
    }
    return validated.data.success
      ? { success: true, data: validated.data.data }
      : { success: false, error: validated.data.error.message }
  }
  console.error(`Failed to create project: ${response.statusText}`)
  return { success: false, error: `Failed to create project: ${response.statusText}` }
}

export async function updateProject(id: number, formData: FormData): Promise<FlattenResponseType<Project>> {
  const response = await fetch(API_URLS.projects.update(id), {
    method: "PUT",
    body: formData,
  })
  if (response.ok) {
    const validated = apiSchema(projectSchema).safeParse(await response.json())
    if (!validated.success) {
      console.error(`Response validation failed: ${validated.error.message}`)
      return { success: false, error: `Response validation failed: ${validated.error.message}` }
    }
    return validated.data.success
      ? { success: true, data: validated.data.data }
      : { success: false, error: validated.data.error.message }
  }
  console.error(`Failed to update project: ${response.statusText}`)
  return { success: false, error: `Failed to update project: ${response.statusText}` }
}

export async function deleteProject(id: number): Promise<FlattenResponseType<null>> {
  const response = await fetch(API_URLS.projects.delete(id), { method: "DELETE" })
  if (response.ok) {
    const validated = apiSchema(z.null()).safeParse(await response.json())
    if (!validated.success) {
      console.error(`Response validation failed: ${validated.error.message}`)
      return { success: false, error: `Response validation failed: ${validated.error.message}` }
    }
    return validated.data.success
      ? { success: true, data: validated.data.data }
      : { success: false, error: validated.data.error.message }
  }
  console.error(`Failed to delete project: ${response.statusText}`)
  return { success: false, error: `Failed to delete project: ${response.statusText}` }
}

export async function getCategories(): Promise<FlattenResponseType<Category[]>> {
  const response = await fetch(API_URLS.categories.list, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok) {
    return { success: false, error: `Failed to fetch categories: ${response.statusText}` }
  }
  const validated = apiSchema(categoryListResponseSchema).safeParse(await response.json())
  if (!validated.success) {
    console.error(`Response validation failed: ${validated.error.message}`)
    return { success: false, error: `Response validation failed: ${validated.error.message}` }
  }
  return validated.data.success
    ? { success: true, data: validated.data.data }
    : { success: false, error: validated.data.error.message }
}

export async function createCategory(data: { title: string }): Promise<FlattenResponseType<Category>> {
  const response = await fetch(API_URLS.categories.create, { method: "POST", body: JSON.stringify(data) })
  if (response.ok) {
    const validated = apiSchema(categorySchema).safeParse(await response.json())
    if (!validated.success) {
      console.error(`Response validation failed: ${validated.error.message}`)
      return { success: false, error: `Response validation failed: ${validated.error.message}` }
    }
    return validated.data.success
      ? { success: true, data: validated.data.data }
      : { success: false, error: validated.data.error.message }
  }
  console.error(`Failed to create category: ${response.statusText}`)
  return { success: false, error: `Failed to create category: ${response.statusText}` }
}

export async function updateCategory(id: number, data: { title: string }): Promise<FlattenResponseType<Category>> {
  const response = await fetch(API_URLS.categories.update(id), { method: "PUT", body: JSON.stringify(data) })
  if (!response.ok) {
    return { success: false, error: `Failed to update category: ${response.statusText}` }
  }
  const validated = apiSchema(categorySchema).safeParse(await response.json())
  if (!validated.success) {
    console.error(`Response validation failed: ${validated.error.message}`)
    return { success: false, error: `Response validation failed: ${validated.error.message}` }
  }
  return validated.data.success
    ? { success: true, data: validated.data.data }
    : { success: false, error: validated.data.error.message }
}

export async function deleteCategory(id: number): Promise<FlattenResponseType<null>> {
  const response = await fetch(API_URLS.categories.delete(id), { method: "DELETE" })
  if (!response.ok) {
    console.error(`Failed to delete category: ${response.statusText}`)
    return { success: false, error: `Failed to delete category: ${response.statusText}` }
  }
  const validated = apiSchema(z.null()).safeParse(await response.json())
  if (!validated.success) {
    console.error(`Response validation failed: ${validated.error.message}`)
    return { success: false, error: `Response validation failed: ${validated.error.message}` }
  }
  return validated.data.success
    ? { success: true, data: validated.data.data }
    : { success: false, error: validated.data.error.message }
}

export async function getTestimonials(): Promise<FlattenResponseType<Testimonial[]>> {
  const response = await fetch(API_URLS.testimonials.list, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok) {
    return { success: false, error: `Failed to fetch testimonials: ${response.statusText}` }
  }
  const validated = apiSchema(testimonialListResponseSchema).safeParse(await response.json())
  if (!validated.success) {
    console.error(`Response validation failed: ${validated.error.message}`)
    return { success: false, error: `Response validation failed: ${validated.error.message}` }
  }
  return validated.data.success
    ? { success: true, data: validated.data.data }
    : { success: false, error: validated.data.error.message }
}

export async function createTestimonial(formData: FormData): Promise<FlattenResponseType<Testimonial>> {
  const response = await fetch(API_URLS.testimonials.create, {
    method: "POST",
    body: formData,
  })
  if (!response.ok) {
    console.error(`Failed to create testimonial: ${response.statusText}`)
    return { success: false, error: `Failed to create testimonial: ${response.statusText}` }
  }
  const validated = apiSchema(testimonialSchema).safeParse(await response.json())
  if (!validated.success) {
    console.error(`Response validation failed: ${validated.error.message}`)
    return { success: false, error: `Response validation failed: ${validated.error.message}` }
  }
  return validated.data.success
    ? { success: true, data: validated.data.data }
    : { success: false, error: validated.data.error.message }
}

export async function updateTestimonial(id: number, formData: FormData): Promise<FlattenResponseType<Testimonial>> {
  const response = await fetch(API_URLS.testimonials.update(id), {
    method: "PUT",
    body: formData,
  })
  if (!response.ok) {
    console.error(`Failed to update testimonial: ${response.statusText}`)
    return { success: false, error: `Failed to update testimonial: ${response.statusText}` }
  }
  const validated = apiSchema(testimonialSchema).safeParse(await response.json())
  if (!validated.success) {
    console.error(`Response validation failed: ${validated.error.message}`)
    return { success: false, error: `Response validation failed: ${validated.error.message}` }
  }
  return validated.data.success
    ? { success: true, data: validated.data.data }
    : { success: false, error: validated.data.error.message }
}

export async function deleteTestimonial(id: number): Promise<FlattenResponseType<null>> {
  const response = await fetch(API_URLS.testimonials.delete(id), { method: "DELETE" })
  if (!response.ok) {
    console.error(`Failed to delete testimonial: ${response.statusText}`)
    return { success: false, error: `Failed to delete testimonial: ${response.statusText}` }
  }
  const validated = apiSchema(z.null()).safeParse(await response.json())
  if (!validated.success) {
    console.error(`Response validation failed: ${validated.error.message}`)
    return { success: false, error: `Response validation failed: ${validated.error.message}` }
  }
  return validated.data.success
    ? { success: true, data: validated.data.data }
    : { success: false, error: validated.data.error.message }
}
