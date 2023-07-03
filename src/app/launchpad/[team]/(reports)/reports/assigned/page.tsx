import { DashboardShell } from "@/components/ui/shell";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { Tenant } from "@prisma/client";
import { getAllocations } from "@/server/services/allocation";
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
        fullName: user?.userName,
        userAvatar: user?.userAvatar,
        timeAssigned: getFormatedData(user?.cumulativeProjectDates),
        isProjectAssigned: user?.projects?.length,
      };
      resultantArray.push(temp);
      user?.projects?.length &&
        user?.projects?.map((project: any) => {
          const temp = {
            id: project?.projectId,
            name: project?.projectName,
            clientName: project?.clientName,
            totalTime: project?.totalTime,
            userName: user.userName,
            timeAssigned: getFormatedData(project?.allocations),
          };
          resultantArray.push(temp);
        });
    });
    return resultantArray;
  };

  const endDate = dayjs().toDate();
  const startDate = dayjs().add(-100, "day").toDate();

  const options = {
    team,
    startDate,
    endDate,
    page: 1,
    pageSize: 20,
  };

  const allocation = await getAllocations(options);

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Assignments" text="This is a summary current assignments">
          <NewAllocationForm team={team} />
        </DashboardHeader>

        <div className="container mx-auto">
          <DataTable data={dataFiltering(allocation)} />
        </div>
      </DashboardShell>
    </>
  );
}
