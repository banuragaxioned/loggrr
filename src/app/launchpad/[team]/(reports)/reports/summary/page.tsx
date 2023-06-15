import { DashboardShell } from "@/components/ui/shell";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { getProjectSummary } from "@/server/services/project";
import { Tenant } from "@prisma/client";

export default async function Page({ params }: { params: { team: Tenant["slug"] } }) {
  const { team } = params;
  const data = await getProjectSummary(team);

  const dataAbstraction = (dataArr:any)=> {
   return dataArr.map((obj:any)=>{
    return {
      id:obj.id,
      name:obj.name,
      budget:obj.Milestone.filter((item:any)=>obj.id === item.projectId )[0]?.budget | 0 ,
      logged:obj.TimeEntry.filter((item:any)=>obj.id === item.projectId )[0]?.time | 0,
      lead:obj.Owner.name,
      leadImage:obj.Owner.image
    }
   });
  }

  const processedData = () => {
    const temp:any = [];
   data.map((obj)=>{
    obj.Project.length > 0 &&
    temp.push({id:obj.id,name:obj.name});
    temp.push(...dataAbstraction(obj.Project))
    });
    return temp;
  }

  return (
    <DashboardShell>
    <DashboardHeader heading="Project list"></DashboardHeader>
    <div className="container mx-auto">
      <DataTable columns={columns} data={processedData()} />
    </div>
  </DashboardShell>
  );
}
