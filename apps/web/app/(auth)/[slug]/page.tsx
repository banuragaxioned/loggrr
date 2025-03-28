import { Organization } from "@workspace/db/schema";
import { notFound } from "next/navigation";
import { MembersList } from "./members-list";
import { caller } from "@/trpc/server";

export type pageProps = { params: Promise<{ slug: Organization["slug"] }> };

export default async function SlugPage(props: pageProps) {
  const params = await props.params;
  const { slug } = params;
  const result = await caller.test.getCurrentUser();

  if (!slug) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Organization Members</h1>
      </div>

      <pre>{JSON.stringify(result, null, 2)}</pre>

      <MembersList />
    </div>
  );
}
