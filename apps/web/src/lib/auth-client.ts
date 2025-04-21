import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  plugins: [
    adminClient(),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
  ],
});

export const { signIn, signOut, useSession } = authClient;
