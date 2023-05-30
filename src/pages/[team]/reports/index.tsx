import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { reportConfig } from "@/config/site";
import { Table, TableHeader } from "@/components/ui/table";

export default function GlobalReports() {
  const { isLoading, isInvalid, isReady, currentTeam } = useValidateTeamAccess();
  const router = useRouter();

  // const reportData = api.report.getAssigned.useQuery({ tenant: currentTeam }, { enabled: isReady });
  const projectData = api.project.getProjects.useQuery({ slug: currentTeam }, { enabled: isReady });
  const reportData = api.report.getLogged.useQuery({ tenant: currentTeam }, { enabled: isReady });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }

  console.log(reportData.data)
  console.log(projectData.data)

  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section className="container flex flex-col items-center justify-center gap-12">
        <h2>Global Reports</h2>
        <Table>
          <TableHeader>
            
          </TableHeader>
        </Table>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {reportConfig.map((item, index) => (
            <Link
              key={index}
              className="hover:bg-zinc/20 flex max-w-xs flex-col gap-4 rounded-xl bg-zinc-400/10 p-4  hover:bg-zinc-400/20"
              href={router.asPath + item.path}
            >
              <h3>{item.name}</h3>
              <div className="text-lg">{item.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
