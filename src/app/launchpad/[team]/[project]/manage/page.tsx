import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import type { Metadata } from 'next';
import { MetadataProps,pageProps} from "@/types";
 
export function generateMetadata({ params, searchParams }: MetadataProps): Metadata {
  return {
    title:`${params.team.replace(params.team[0],params.team[0].toUpperCase())} | Manage`
  }
}

export default async function Page({params}:pageProps) {
  generateMetadata({params})
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Manage Project" text="Manage your project here"></DashboardHeader>
      </DashboardShell>
    </>
  );
}
