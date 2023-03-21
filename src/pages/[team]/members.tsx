/* eslint-disable react/no-unescaped-entities */
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/tenantValidation";
import { api } from "@/utils/api";
import { getInitials } from "@/utils/helper";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function Members() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentTenant = router.query.team as string;
  
  const memberData = api.tenant.getTenantMembers.useQuery(
    { slug: currentTenant },
    { enabled: session?.user !== undefined }
  );
  
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  const connectUserToTenantMutation =  api.tenant.connectUserToTenant.useMutation();
  const addMemberHandler = () => {
    
    if (emailInputRef?.current?.value === undefined) return;
    
    const newMember = connectUserToTenantMutation.mutate({
      email: emailInputRef.current.value, tenant: currentTenant
    });

    return newMember;
  };

  const { isLoading, isInvalid } = useValidateTenantAccess();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  return (
    <div className="mx-auto flex flex-col max-w-6xl px-4 lg:px-0">
      
      <section>
        <div className="lg:w-2/4 flex flex-col gap-4">
          <h2>Add members</h2>
          <Input placeholder="Email" type="text" ref={emailInputRef} />
          <Button onClick={addMemberHandler}>Add member</Button>
        </div>
      </section>

      <section>
        <h2>Members</h2>
        <ul className="flex flex-col gap-4">
          {memberData.data &&
            memberData.data.users.map((member) => (
              <li
                key={member.id}
                className="hover:bg-zinc/20 flex max-w-xs rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
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
