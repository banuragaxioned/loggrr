import { Organization } from "@workspace/db/schema";
import { notFound } from "next/navigation";
import { MembersList } from "./members-list";
import { caller } from "@/trpc/server";
import { ClientGreeting } from "./client-greeting";

export type pageProps = { params: Promise<{ slug: Organization["slug"] }> };

export default async function SlugPage(props: pageProps) {
  const params = await props.params;
  const { slug } = params;

  const members = await caller.organization.getMembers();
  const teams = await caller.organization.getTeams();

  if (!slug) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Members</h2>
        <pre>{JSON.stringify(members, null, 2)}</pre>
      </div>
      <div>
        <h2 className="text-2xl font-bold">Teams</h2>
        <pre>{JSON.stringify(teams, null, 2)}</pre>
      </div>
      <ClientGreeting />
      <MembersList />
    </div>
  );
}
