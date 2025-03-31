import { Organization } from "@workspace/db/schema";
import { notFound } from "next/navigation";
import { caller } from "@/trpc/server";
import { ClientTeams } from "./client-teams";
import { UserAvatar } from "@/components/ui/user-avatar";
import { InfoCard } from "@/components/ui/info-card";

export type pageProps = { params: Promise<{ slug: Organization["slug"] }> };

export default async function SlugPage(props: pageProps) {
  const params = await props.params;
  const { slug } = params;

  const currentMember = await caller.organization.currentMember();
  const teams = await caller.organization.getTeams();

  if (!slug) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <h2 className="text-2xl font-bold">Teams (server)</h2>
            <pre>{JSON.stringify(teams, null, 2)}</pre>
          </div>
          <div className="col-span-1">
            <h2 className="text-2xl font-bold">Teams (client)</h2>
            <ClientTeams />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Members</h2>
        {currentMember && (
          <InfoCard
            id={currentMember.id}
            title={currentMember.user.name}
            description={currentMember.role}
            image={currentMember.user.image}
            href={`/${currentMember.user.id}`}
            showAvatar={true}
          />
        )}
      </div>
    </div>
  );
}
