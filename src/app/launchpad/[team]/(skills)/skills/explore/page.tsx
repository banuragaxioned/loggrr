import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { NewSkillForm } from "@/components/forms/skillForm";
import { getSkills } from "@/server/services/skill";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { DataTable } from "./data-table";
import { DataTableToolbar } from "./toolbar";

export const metadata: Metadata = {
  title: `Explore`,
};

export default async function SkillsSummary({ params }: pageProps) {
  const skills = await getSkills(params.team);
  const { team } = params;
  return (
    <DashboardShell>
      <DashboardHeader heading="All Skills" text="These are all the skills that are on our radar.">
        <NewSkillForm team={team} />
      </DashboardHeader>
      <DataTable skills={skills} />
        
    </DashboardShell>
  );
}
