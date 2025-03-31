import { Button } from "@workspace/ui/components/button";
import { MembersList } from "./client";

export default function OrganizationMembersPage() {
  return (
    <div className="space-y-8">
      <Button variant="default">Invite Member</Button>
      <Button variant="destructive">Remove Member</Button>
      <h2 className="text-2xl font-bold">Members</h2>
      <MembersList />
    </div>
  );
}
