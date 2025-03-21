import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient, magicLinkClient } from "better-auth/client/plugins";
import { toast } from "@workspace/ui/components/sonner";

export const authClient = createAuthClient({
  plugins: [adminClient(), organizationClient(), magicLinkClient()],
  fetchOptions: {
    onError: (ctx) => {
      toast.error(ctx.error.message);
    },
  },
});
