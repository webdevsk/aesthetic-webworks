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

export const adminApi = {
  projects: {
    list: async (): Promise<Project[]> => {
      const response = await fetch(API_URLS.projects.list)
      if (!response.ok) throw new Error("Failed to fetch projects")
      return response.json()
    },
    create: async (formData: FormData): Promise<Project> => {
      const response = await fetch(API_URLS.projects.create, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to create project")
      return response.json()
    },
    update: async (id: number, formData: FormData): Promise<Project> => {
      const response = await fetch(API_URLS.projects.update(id), {
        method: "PUT",
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to update project")
      return response.json()
    },
    delete: async (id: number): Promise<void> => {
      const response = await fetch(API_URLS.projects.delete(id), {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete project")
    },
  },
  categories: {
    list: async (): Promise<Category[]> => {
      const response = await fetch(API_URLS.categories.list)
      if (!response.ok) throw new Error("Failed to fetch categories")
      return response.json()
    },
    create: async (data: { title: string }): Promise<Category> => {
      const response = await fetch(API_URLS.categories.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create category")
      return response.json()
    },
    update: async (id: number, data: { title: string }): Promise<Category> => {
      const response = await fetch(API_URLS.categories.update(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to update category")
      return response.json()
    },
    delete: async (id: number): Promise<void> => {
      const response = await fetch(API_URLS.categories.delete(id), {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete category")
    },
  },
  testimonials: {
    list: async (): Promise<Testimonial[]> => {
      const response = await fetch(API_URLS.testimonials.list)
      if (!response.ok) throw new Error("Failed to fetch testimonials")
      return response.json()
    },
    create: async (formData: FormData): Promise<Testimonial> => {
      const response = await fetch(API_URLS.testimonials.create, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to create testimonial")
      return response.json()
    },
    update: async (id: number, formData: FormData): Promise<Testimonial> => {
      const response = await fetch(API_URLS.testimonials.update(id), {
        method: "PUT",
        body: formData,
      })
      if (!response.ok) throw new Error("Failed to update testimonial")
      return response.json()
    },
    delete: async (id: number): Promise<void> => {
      const response = await fetch(API_URLS.testimonials.delete(id), {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete testimonial")
    },
  },
}
