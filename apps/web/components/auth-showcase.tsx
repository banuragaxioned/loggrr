import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth, getSession } from "@workspace/auth";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";

async function listUsers() {
  const result = await auth.api.listUsers({
    headers: await headers(),
    query: {},
  });
  return result.users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));
}

async function listOrganizations() {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });
  return organizations.map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
  }));
}

export async function AuthShowcase() {
  const session = await getSession();
  const users = await listUsers();
  const organizations = await listOrganizations();

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
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl mx-auto px-4">
      <p className="text-center">
        <span>Logged in as {session.user.name}</span>
      </p>

      {/* User Section */}
      <section className="w-full">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>List Users</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Users</DialogTitle>
                <DialogDescription>List of all users in the system</DialogDescription>
              </DialogHeader>
              <div className="border rounded-lg p-4 space-y-2 max-h-[300px] overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(users, null, 2)}</pre>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <Separator />

      {/* Organization Section */}
      <section className="w-full">
        <h2 className="text-xl font-bold mb-4">Organizations</h2>
        <div className="flex gap-2 flex-wrap">
          <Dialog>
            <DialogTrigger asChild>
              <Button>List Organizations</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Organizations</DialogTitle>
                <DialogDescription>List of all organizations</DialogDescription>
              </DialogHeader>
              <div className="border rounded-lg p-4 space-y-2 max-h-[300px] overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(organizations, null, 2)}</pre>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Organization</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Organization</DialogTitle>
                <DialogDescription>Create a new organization to collaborate with your team.</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Organization Name</Label>
                  <Input id="name" name="name" placeholder="Acme Corp" required />
                </div>
                <div>
                  <Label htmlFor="slug">Organization Slug</Label>
                  <Input id="slug" name="slug" placeholder="acme-corp" required />
                </div>
                <DialogFooter>
                  <Button
                    formAction={async (formData: FormData) => {
                      "use server";
                      const name = formData.get("name") as string;
                      const slug = formData.get("slug") as string;

                      await auth.api.createOrganization({
                        headers: await headers(),
                        body: {
                          name,
                          slug,
                        },
                      });

                      redirect("/");
                    }}>
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <Separator />

      {/* Sign Out Section */}
      <section className="w-full">
        <div className="flex justify-center">
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
      </section>
    </div>
  );
}
