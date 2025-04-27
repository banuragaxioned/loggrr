import { DashboardHeader, DashboardShell } from "@/components/shell";
import { MembersList } from "./members-list";

export default function MembersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Members" text="You can find the list of members here"></DashboardHeader>
      <MembersList />
    </DashboardShell>
  );
}
