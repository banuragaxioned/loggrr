import { Organization } from "@workspace/db/schema";
import { notFound } from "next/navigation";

export type pageProps = { params: Promise<{ slug: Organization["slug"] }> };

export default async function SlugPage(props: pageProps) {
  const params = await props.params;
  const { slug } = params;
  // TODO: Add organization validation logic
  if (!slug) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold">Slug: {slug}</h1>
    </div>
  );
}
