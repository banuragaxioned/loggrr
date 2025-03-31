"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function ClientTeams() {
  const trpc = useTRPC();

  const response = useQuery(trpc.organization.getTeams.queryOptions());
  if (!response.data) return <div>Loading...</div>;
  return (
    <>
      <pre>{JSON.stringify(response.data, null, 2)}</pre>
    </>
  );
}
