import { notFound } from "next/navigation";

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
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
