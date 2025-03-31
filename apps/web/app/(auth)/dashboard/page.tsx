import { caller } from "@/trpc/server";
import { InfoCard } from "@/components/ui/info-card";

export default async function Page() {
  const organizations = await caller.organization.getAll();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Your Organizations</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {organizations.map((org) => (
          <InfoCard
            key={org.id}
            id={org.id}
            title={org.name}
            description={org.slug}
            href={`/${org.slug}`}
            showAvatar={false}
          />
        ))}
      </div>
    </div>
  );
}
