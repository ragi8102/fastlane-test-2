import { auth } from "./auth"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const session = await auth()
  if (!session) {
    throw new Error("Authentication required")
  }
  return session
}
