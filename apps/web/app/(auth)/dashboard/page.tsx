import { caller } from "@/trpc/server";
import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Link from "next/link";

export default async function Page() {
  const organizations = await caller.organization.getAll();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Your Organizations</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {organizations.map((org) => (
          <Link key={org.id} href={`/${org.slug}`}>
            <Card>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>{org.slug}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
