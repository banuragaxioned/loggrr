"use client";
// <-- hooks can only be used in client components
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function ClientGreeting() {
  const trpc = useTRPC();

  const greeting = useQuery(trpc.user.get.queryOptions());
  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.user.name}</div>;
}
