"use client";

import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-muted-foreground">
              {healthCheck.isLoading ? "Checking..." : healthCheck.data ? "Connected" : "Disconnected"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <li className="border-l-2 border-primary py-1 pl-3">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </li>
  );
}
