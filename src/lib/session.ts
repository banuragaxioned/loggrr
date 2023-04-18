import { authOptions } from "@/server/auth"
import { getServerSession } from "next-auth/next"


export async function getSessionOld() {
  return await getServerSession(authOptions)
}

export default async function getSession() {
  const session = await getServerSession(authOptions)
  return session
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}
