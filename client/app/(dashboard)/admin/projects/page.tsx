import { redirectIfNotAuthorized } from "@/utils/redirect-if-not-authorized"
import { ProjectsPage } from "./projects-page"

export default async function Page() {
  await redirectIfNotAuthorized("/auth/signin")
  return <ProjectsPage />
}
