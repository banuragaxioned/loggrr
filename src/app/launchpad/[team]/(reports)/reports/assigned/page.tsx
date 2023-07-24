import { DashboardShell } from "@/components/ui/shell";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { Tenant } from "@prisma/client";
import { getAllocations, getProjectsId, getAllUsers } from "@/server/services/allocation";
import dayjs from "dayjs";
import { NewAllocationForm } from "@/components/forms/allocationForm";

export default async function Assigned({ params }: { params: { team: Tenant["slug"] } }) {
  const { team } = params;

  const getFormatedData = (timeArr: any) => {
    const resultObj: any = {};
    for (let x in timeArr) {
      const date = new Date(x).toLocaleString("en-us", { day: "2-digit", month: "short", year: "2-digit" });
      resultObj[date] = timeArr[x];
    }
    return resultObj;
  };

  const dataFiltering = (data: any) => {
    const resultantArray: any = [];
    const notEmptyArr = data.filter((user: any) => user?.userName);
    notEmptyArr.map((user: any) => {
      const temp = {
        id: user?.userId,
        name: user?.userName.split(" ")[0],
        title: user?.userName,
        userAvatar: user?.userAvatar,
        timeAssigned: getFormatedData(user?.cumulativeProjectDates),
        isProjectAssigned: user?.projects?.length,
      };
      resultantArray.push(temp);
      user?.projects?.length &&
        user?.projects?.map((project: any) => {
          const temp = {
            id: project?.projectId,
            userId:user.userId,
            name: project?.projectName.slice(0,5)+"...",
            title:project?.projectName,
            clientName: project?.clientName,
            totalTime: project?.totalTime,
            userName: user.userName,
            billable: project?.billable,
            frequency:project?.frequency,
            timeAssigned: getFormatedData(project?.allocations),
          };
          resultantArray.push(temp);
        });
    });
    return resultantArray;
  };

  const endDate = dayjs().add(14, "day").toDate();
  const startDate = dayjs(new Date().setDate(18)).toDate();

  const options = {
    team,
    startDate,
    endDate,
    page: 1,
    pageSize: 20,
  };
  const allocation = await getAllocations(options);
  const projects = await getProjectsId(team)

  const users = await getAllUsers(team);
  const response = await fetch("/api/team/allocation/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
     options
    }),
  }).then(res=>res).then(commit=>console.log(commit)).catch(e=>console.log(e));

  
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Assignments" text="This is a summary current assignments">
          <NewAllocationForm team={team} projects={projects} users={users}/>
        </DashboardHeader>
        <div className="container mx-auto">
          <DataTable tableData={dataFiltering(allocation)}/>
        </div>
      </DashboardShell>
    </>
  );
}
