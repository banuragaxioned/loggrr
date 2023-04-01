import { useValidateTenantAccess } from "@/hooks/useTenant";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Unavailable from "@/components/unavailable";
import { useRef } from "react";
import { api } from "@/utils/api";

export default function ManageProject() {
  const { isLoading, isInvalid, isReady, slug, pid } =
    useValidateTenantAccess();
  const { data: memberData, refetch: refetchMembers } =
    api.project.getMembers.useQuery(
      { projectId: pid, slug: slug },
      { enabled: isReady }
    );

  const emailInputRef = useRef<HTMLInputElement>(null);

  const connectUserToTenantMutation =
    api.tenant.connectUserToTenant.useMutation({
      onSuccess: (data) => {
        refetchMembers();
      },
    });

  const addMemberHandler = () => {
    if (emailInputRef?.current?.value === undefined) return;

    const newMember = connectUserToTenantMutation.mutate({
      email: emailInputRef.current.value,
      tenant: slug,
    });

    return newMember;
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }

  return (
    <div className="mx-auto max-w-6xl flex-col gap-4">
      <section>
        <h2>Manage Project</h2>
        <div className="col-12">
          <h3 className="pb-3">Members</h3>
          <h4>Owner:</h4>
          {memberData?.map((members) => (
            <p key={members.Owner.id}>{members.Owner.name}</p>
          ))}
          <h4>All members:</h4>
          <ul>
            {memberData?.map((members) =>
              members.Members.map((member) => (
                <li key={member.id}>{member.name}</li>
              ))
            )}
          </ul>
        </div>
      </section>
      <div className="mx-auto flex max-w-6xl flex-col px-4 lg:px-0">
        <section>
          <div className="flex flex-col lg:w-2/4">
            <h3>Add members</h3>
            <Input placeholder="Email" type="text" ref={emailInputRef} />
            <Button onClick={addMemberHandler}>Add member</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
