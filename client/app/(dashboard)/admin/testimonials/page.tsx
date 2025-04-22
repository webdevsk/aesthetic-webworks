import { redirectIfNotAuthorized } from "@/utils/redirect-if-not-authorized"
import { TestimonialsPage } from "./testimonial-page"

export default async function Page() {
  await redirectIfNotAuthorized("/auth/signin")
  return <TestimonialsPage />
}
