import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import type { Metadata } from 'next';
import { MetadataProps,pageProps} from "@/types";
 
export function generateMetadata({ params, searchParams }: MetadataProps): Metadata {
  return {
    title:`${params.team.replace(params.team[0],params.team[0].toUpperCase())} | Projects`
  }
}

export default async function Page({params}:pageProps) {
  generateMetadata({params})
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Project Details page" text="This is your project details page."></DashboardHeader>
      </DashboardShell>
    </>
  );
}
