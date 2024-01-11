import { DashboardHeader } from "components/ui/header";
import { DashboardShell } from "components/ui/shell";
import { NewSkillForm } from "components/forms/skillForm";
import { getSkills } from "server/services/skill";
import type { Metadata } from "next";
import { pageProps } from "types";
import { DataTable } from "./data-table";

export const metadata: Metadata = {
  title: `Explore`,
};

export default async function SkillsSummary({ params }: pageProps) {
  const { team } = params;
  const skills = await getSkills(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="All Skills" text="These are all the skills that are on our radar.">
        <NewSkillForm team={team} />
      </DashboardHeader>
      <DataTable skills={skills} team={team} />
    </DashboardShell>
  );
}
