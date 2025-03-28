import { Organization } from "@workspace/db/schema";
import { notFound } from "next/navigation";
import { MembersList } from "./members-list";
import { caller, getQueryClient } from "@/trpc/server";
import { ClientGreeting } from "./client-greeting";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export type pageProps = { params: Promise<{ slug: Organization["slug"] }> };

export default async function SlugPage(props: pageProps) {
  const params = await props.params;
  const { slug } = params;
  const result = await caller.user.get();
  const queryClient = getQueryClient();

  if (!slug) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Organization Members</h1>
        </div>

        <pre>{JSON.stringify(result, null, 2)}</pre>
        <ClientGreeting />

        <MembersList />
      </div>
    </HydrationBoundary>
  );
}
