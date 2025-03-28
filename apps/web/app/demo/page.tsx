import { caller } from "@/trpc/server";

export default async function DemoPage() {
  const result = await caller.test.hello({ name: "Server" });

  return (
    <div className="p-8">
      <div className="p-4 bg-secondary rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Server Component Result:</h2>
        <p>{result.greeting}</p>
      </div>
    </div>
  );
}
