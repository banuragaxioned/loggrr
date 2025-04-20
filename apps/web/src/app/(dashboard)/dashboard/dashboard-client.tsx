"use client";

import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";

export default function DashboardClient() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const privateData = useQuery(trpc.privateData.queryOptions());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!session && !isPending) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // During SSR and initial client render, render nothing
  // This prevents hydration mismatch entirely
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <p>Welcome {session?.user.name}</p>
      <p>privateData: {privateData.data?.message}</p>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
