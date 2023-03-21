/* eslint-disable react/no-unescaped-entities */
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Projects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const memberData = api.tenant.getTenantClients.useQuery(
    { text: currentTenant },
    { enabled: session?.user !== undefined }
  );

  const { isLoading, isInvalid } = useValidateTenantAccess();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>Projects</h2>
        <Link href={router.asPath + "/pid"}>Project Details</Link>
        <ul>
          {memberData.data &&
            memberData.data.client.map((client) => (
              <li
                key={client.id}
                className="hover:bg-zinc/20 flex max-w-xs flex-col gap-4 rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                <span className="flex place-items-center gap-4">
                  {client.name}
                </span>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
