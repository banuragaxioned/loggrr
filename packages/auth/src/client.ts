import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [adminClient(), organizationClient(), magicLinkClient()],
});

export const { signIn, signOut, useSession } = authClient;
