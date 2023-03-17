import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Members() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const memberData = api.tenant.getTenantMembers.useQuery(
    { text: currentTenant },
    { enabled: session?.user !== undefined }
  );
  console.log(memberData.data?.users);

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
        <h2>Members</h2>
        {memberData.data &&
          memberData.data.users.map((member) => (
            <li
              key={member.id}
              className="hover:bg-zinc/20 flex max-w-xs flex-col gap-4 rounded-xl bg-zinc-400/10 p-4  hover:bg-zinc-400/20"
            >
              <span className="place-cent flex gap-4">
                <Image
                  src={member.image ? member.image : "/favicon.svg"}
                  alt="profile"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                {member.name}
              </span>
            </li>
          ))}
      </section>
    </div>
  );
}
