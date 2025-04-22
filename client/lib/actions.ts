import { type Category, type Project, ProjectWithCategories, type Testimonial } from "@/db/schema"
import { RouteApiType } from "@/types/api"
import { API_URLS } from "./api-urls"

type FlattenResponseType<T> = { success: true; data: T } | { success: false; error: string }

export async function getProjects(): Promise<FlattenResponseType<ProjectWithCategories[]>> {
  const response = await fetch(API_URLS.projects.list, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json() as Promise<RouteApiType<ProjectWithCategories[]>>)
  if (!response.success) {
    console.error(`Failed to fetch projects: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function createProject(formData: FormData): Promise<FlattenResponseType<Project>> {
  const response = await fetch(API_URLS.projects.create, {
    method: "POST",
    body: formData,
  }).then((res) => res.json() as Promise<RouteApiType<Project>>)
  if (!response.success) {
    console.error(`Failed to create project: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function updateProject(id: number, formData: FormData): Promise<FlattenResponseType<Project>> {
  const response = await fetch(API_URLS.projects.update(id), {
    method: "PUT",
    body: formData,
  }).then((res) => res.json() as Promise<RouteApiType<Project>>)
  if (!response.success) {
    console.error(`Failed to update project: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function deleteProject(id: number): Promise<FlattenResponseType<null>> {
  const response = await fetch(API_URLS.projects.delete(id), { method: "DELETE" }).then(
    (res) => res.json() as Promise<RouteApiType<null>>
  )
  if (!response.success) {
    console.error(`Failed to delete project: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function getCategories(): Promise<FlattenResponseType<Category[]>> {
  const response = await fetch(API_URLS.categories.list, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json() as Promise<RouteApiType<Category[]>>)
  if (!response.success) {
    console.error(`Failed to fetch categories: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function createCategory(data: { title: string }): Promise<FlattenResponseType<Category>> {
  const response = await fetch(API_URLS.categories.create, { method: "POST", body: JSON.stringify(data) }).then(
    (res) => res.json() as Promise<RouteApiType<Category>>
  )
  if (!response.success) {
    console.error(`Failed to create category: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function updateCategory(id: number, data: { title: string }): Promise<FlattenResponseType<Category>> {
  const response = await fetch(API_URLS.categories.update(id), { method: "PUT", body: JSON.stringify(data) }).then(
    (res) => res.json() as Promise<RouteApiType<Category>>
  )
  if (!response.success) {
    console.error(`Failed to update category: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function deleteCategory(id: number): Promise<FlattenResponseType<null>> {
  const response = await fetch(API_URLS.categories.delete(id), { method: "DELETE" }).then(
    (res) => res.json() as Promise<RouteApiType<null>>
  )
  if (!response.success) {
    console.error(`Failed to delete category: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function getTestimonials(): Promise<FlattenResponseType<Testimonial[]>> {
  const response = await fetch(API_URLS.testimonials.list, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json() as Promise<RouteApiType<Testimonial[]>>)
  if (!response.success) {
    console.error(`Failed to fetch testimonials: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function createTestimonial(formData: FormData): Promise<FlattenResponseType<Testimonial>> {
  const response = await fetch(API_URLS.testimonials.create, {
    method: "POST",
    body: formData,
  }).then((res) => res.json() as Promise<RouteApiType<Testimonial>>)
  if (!response.success) {
    console.error(`Failed to create testimonial: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function updateTestimonial(id: number, formData: FormData): Promise<FlattenResponseType<Testimonial>> {
  const response = await fetch(API_URLS.testimonials.update(id), {
    method: "PUT",
    body: formData,
  }).then((res) => res.json() as Promise<RouteApiType<Testimonial>>)
  if (!response.success) {
    console.error(`Failed to update testimonial: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}

export async function deleteTestimonial(id: number): Promise<FlattenResponseType<null>> {
  const response = await fetch(API_URLS.testimonials.delete(id), { method: "DELETE" }).then(
    (res) => res.json() as Promise<RouteApiType<null>>
  )
  if (!response.success) {
    console.error(`Failed to delete testimonial: ${response.error.message}`)
    return { success: false, error: response.error.message }
  }
  return { success: true, data: response.data }
}
