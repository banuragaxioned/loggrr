import { Organization } from "@workspace/db/schema";
import { notFound } from "next/navigation";
import { MembersList } from "./members-list";
import { caller } from "@/trpc/server";
import { ClientGreeting } from "./client-greeting";

export type pageProps = { params: Promise<{ slug: Organization["slug"] }> };

export default async function SlugPage(props: pageProps) {
  const params = await props.params;
  const { slug } = params;

  const user = await caller.user.get();
  const organizations = await caller.organization.getAll();
  const activeMember = await caller.organization.getActiveMember();

  if (!slug) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Organization Members</h1>
      </div>

      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(organizations, null, 2)}</pre>
      <pre>{JSON.stringify(activeMember, null, 2)}</pre>
      <ClientGreeting />
      <MembersList />
    </div>
  );
}
