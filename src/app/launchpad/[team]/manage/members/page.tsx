import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { DataTable } from "./data-table";

const Members = async ({ params }: { params: { team: string } }) => {
  const { team } = params;

  return (
    <DashboardShell>
      <DashboardHeader heading="Members" text={`This is a list of  all the member in ${team} team `}></DashboardHeader>
      <DataTable team={team} />
    </DashboardShell>
  );
};

export default Members;
