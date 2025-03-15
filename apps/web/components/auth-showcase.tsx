import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth, getSession } from "@workspace/auth";

import { Button } from "@workspace/ui/components/button";

export async function AuthShowcase() {
  const session = await getSession();
  if (!session) {
    return (
      <form>
        <Button
          formAction={async () => {
            "use server";
            const res = await auth.api.signInSocial({
              body: {
                provider: "google",
                callbackURL: "/",
              },
            });
            if (res.url) {
              redirect(res.url);
            }
          }}>
          Sign in with Google
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center">
        <span>Logged in as {session.user.name}</span>
      </p>

      <form>
        <Button
          formAction={async () => {
            "use server";
            await auth.api.signOut({
              headers: await headers(),
            });
            redirect("/");
          }}>
          Sign out
        </Button>
      </form>
    </div>
  );
}
