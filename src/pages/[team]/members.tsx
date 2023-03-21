/* eslint-disable react/no-unescaped-entities */
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { api } from "@/utils/api";
import { getInitials } from "@/utils/helper";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
        <ul>
          {memberData.data &&
            memberData.data.users.map((member) => (
              <li
                key={member.id}
                className="hover:bg-zinc/20 flex max-w-xs flex-col gap-4 rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                <span className="flex place-items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={member.image ?? ""}
                      alt={member.name ?? ""}
                    />
                    <AvatarFallback>
                      {getInitials(member.name ?? "Loggr User")}
                    </AvatarFallback>
                  </Avatar>
                  {member.name}
                </span>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
