"use client";

import { Button } from "@workspace/ui/components/button";
import { authClient } from "@workspace/auth/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      type="button"
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
            },
          },
        })
      }
    >
      Logout
    </Button>
  );
}
