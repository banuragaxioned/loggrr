"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { authClient } from "@workspace/auth/client";

export function Organizations() {
  const { data: organizations, isPending, isRefetching } = authClient.useListOrganizations();

  if (isPending || isRefetching) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-full animate-pulse">
            <CardHeader>
              <div className="h-6 w-24 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!organizations?.length) {
    return (
      <Card className="p-6">
        <CardTitle>No Organizations Found</CardTitle>
        <CardDescription>You are not a member of any organizations yet.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {organizations.map((org) => (
        <Link key={org.id} href={`/${org.slug}`}>
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
              <CardDescription>{org.slug}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
