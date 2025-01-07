const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const API_URLS = {
  projects: {
    list: `${BASE_URL}/api/projects`,
    create: `${BASE_URL}/api/projects`,
    update: (id: number) => `${BASE_URL}/api/projects/${id}`,
    delete: (id: number) => `${BASE_URL}/api/projects/${id}`,
  },
  categories: {
    list: `${BASE_URL}/api/categories`,
    create: `${BASE_URL}/api/categories`,
    update: (id: number) => `${BASE_URL}/api/categories/${id}`,
    delete: (id: number) => `${BASE_URL}/api/categories/${id}`,
  },
  testimonials: {
    list: `${BASE_URL}/api/testimonials`,
    create: `${BASE_URL}/api/testimonials`,
    update: (id: number) => `${BASE_URL}/api/testimonials/${id}`,
    delete: (id: number) => `${BASE_URL}/api/testimonials/${id}`,
  },
}
