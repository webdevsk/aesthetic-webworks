// (If using separate backend) const BASE_URL = process.env.NEXT_PUBLIC_API_URL
export const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
    ? "http://" + process.env.NEXT_PUBLIC_VERCEL_URL!
    : "https://" + process.env.NEXT_PUBLIC_VERCEL_URL!
// const BASE_URL = ""

// Prepending BASE_URL as server actions cannot hit route handlers when the url doesnt have a hostname
// This is unnecessary if we don't use server actions at all

export const API_URLS = {
  auth: {
    signup: `/api/auth/signup`,
    signin: `/api/auth/signin`,
  },
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
