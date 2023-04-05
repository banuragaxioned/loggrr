import { useValidateTenantAccess } from "@/hooks/useTenant";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Unavailable from "@/components/unavailable";
import { useRef } from "react";
import { api } from "@/utils/api";

export default function ManageProject() {
  const { isLoading, isInvalid, isReady, slug, pid } = useValidateTenantAccess();

  const { data: memberData, refetch: refetchMembers } = api.project.getMembers.useQuery(
    { projectId: pid, slug: slug },
    { enabled: isReady }
  );

  const userInputRef = useRef<HTMLInputElement>(null);

  const connectUserToProjectMutation = api.project.addMember.useMutation({
    onSuccess: (data) => {
      refetchMembers();
    },
  });

  const addMemberHandler = () => {
    if (userInputRef?.current?.value === undefined) return;

    const newMember = connectUserToProjectMutation.mutate({
      userId: userInputRef.current.value,
      projectId: pid,
    });
  };

  const disconnectUserToProjectMutation = api.project.removeMember.useMutation({
    onSuccess: (data) => {
      refetchMembers();
    },
  });

  const removeMemberHandler = () => {
    if (userInputRef?.current?.value === undefined) return;

    const removeMember = disconnectUserToProjectMutation.mutate({
      userId: userInputRef.current.value,
      projectId: pid,
    });

    return removeMember;
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
            {memberData?.map((members) => members.Members.map((member) => <li key={member.id}>{member.name}</li>))}
          </ul>
        </div>
        <h3>Add members</h3>
        <Input placeholder="Enter the userID" type="text" ref={userInputRef} />
        <div className="my-2 flex gap-4">
          <Button onClick={addMemberHandler}>Add member</Button>
          <Button onClick={removeMemberHandler}>Remove member</Button>
        </div>
      </section>
    </div>
  );
}
