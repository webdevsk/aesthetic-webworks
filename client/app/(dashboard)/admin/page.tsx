import { redirectIfNotAuthorized } from "@/utils/redirect-if-not-authorized"
import { AdminPage } from "./admin-page"

export default async function Page() {
  await redirectIfNotAuthorized("/auth/signin")
  return <AdminPage />
}
