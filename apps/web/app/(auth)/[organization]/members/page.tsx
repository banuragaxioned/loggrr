import { MembersList } from "./client";

export default function OrganizationMembersPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Members</h2>
      <MembersList />
    </div>
  );
}
