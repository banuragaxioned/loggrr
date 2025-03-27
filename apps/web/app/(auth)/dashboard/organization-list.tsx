"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { authClient } from "@workspace/auth/client";
import { toast } from "@workspace/ui/components/sonner";

function OrganizationSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-[180px] mb-2" />
            <Skeleton className="h-4 w-[120px]" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export function OrganizationList() {
  const { data: organizations, error, isPending } = authClient.useListOrganizations();

  if (isPending) {
    return <OrganizationSkeleton />;
  }

  if (error) {
    toast.error("Error fetching organizations");
    return null;
  }

  if (!organizations?.length) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <p className="text-muted-foreground">No organizations found.</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
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
  );
}
