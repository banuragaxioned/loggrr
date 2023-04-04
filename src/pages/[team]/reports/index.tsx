import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";
import Link from "next/link";
import { useRouter } from "next/router";
import { reportConfig } from "@/config/site";

export default function GlobalReports() {
  const { isLoading, isInvalid } = useValidateTenantAccess();
  const router = useRouter();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section className="container flex flex-col items-center justify-center gap-12">
        <h2>Global Reports</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {reportConfig.map((item, index) => (
            <Link
              key={index}
              className="hover:bg-zinc/20 flex max-w-xs flex-col gap-4 rounded-xl bg-zinc-400/10 p-4  hover:bg-zinc-400/20"
              href={router.asPath + item.path}
            >
              <h3>{item.name}</h3>
              <div className="text-lg">{item.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
