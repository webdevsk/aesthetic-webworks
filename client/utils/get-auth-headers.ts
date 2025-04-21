import { cookies } from "next/headers"

export const getAuthHeaders = async (isMultipart = false) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) {
    throw new Error("Authentication required")
  }
  return {
    Authorization: `Bearer ${token}`,
    ...(isMultipart ? {} : { "Content-Type": "application/json" }),
  }
}
