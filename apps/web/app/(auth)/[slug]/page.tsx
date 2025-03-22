import { Organization } from "@workspace/db/schema";
import { notFound } from "next/navigation";
import { MembersList } from "./members-list";

export type pageProps = { params: Promise<{ slug: Organization["slug"] }> };

export default async function SlugPage(props: pageProps) {
  const params = await props.params;
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Organization Members</h1>
      </div>

      <MembersList />
    </div>
  );
}
