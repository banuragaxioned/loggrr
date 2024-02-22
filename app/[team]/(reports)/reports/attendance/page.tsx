import type { Metadata } from "next";
import { getProjects, getClients } from "@/server/services/project";
import { getAllUsers } from "@/server/services/allocation";
import { NewProjectForm } from "@/components/forms/projectForm";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { pageProps } from "@/types";
import { Table } from "./table";
import { columns } from "./columns";
import { getAttendance } from "@/server/services/attendance";

export const metadata: Metadata = {
  title: `Attendance`,
};
export default async function Projects({ params }: pageProps) {
  const { team } = params;
  const attendance = await getAttendance(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Attendance" text="This is all employees attendance" />
      <Table columns={columns} data={attendance} />
    </DashboardShell>
  );
}
