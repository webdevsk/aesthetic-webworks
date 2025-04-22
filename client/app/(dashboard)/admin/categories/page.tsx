import { redirectIfNotAuthorized } from "@/utils/redirect-if-not-authorized"
import { CategoriesPage } from "./categories-page"

export default async function Page() {
  await redirectIfNotAuthorized("/auth/signin")
  return <CategoriesPage />
}
