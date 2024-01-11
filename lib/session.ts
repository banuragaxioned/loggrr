import { getServerSession } from "next-auth/next";

import { authOptions } from "@/server/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return session.user;
}
