"server only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const redirectIfNotAuthorized = async (redirectUrl: string) => {
  const token = (await cookies()).get("token")
  if (!token) {
    redirect(redirectUrl)
  }
}
