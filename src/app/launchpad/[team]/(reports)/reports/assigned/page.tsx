import { DashboardShell } from "@/components/ui/shell";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { Tenant } from "@prisma/client";
import { getAllocations } from "@/server/services/allocation";
import dayjs from "dayjs";
import { json } from "stream/consumers";

export default async function Assigned({ params }: { params: { team: Tenant["slug"] } }) {
  const { team } = params;
  const tempData = [
    {
      "globalView": true,
      "userId": 13,
      "userName": null,
      "userAvatar": "http://localhost:3000/avatar.png",
      "totalTime": 0,
      "averageTime": 0,
      "cumulativeProjectDates": {},
      "projects": []
    },
    {
      "globalView": true,
      "userId": 6,
      "userName": "Ajay P",
      "userAvatar": "https://lh3.googleusercontent.com/a/AGNmyxbi35RYrSuGEJODO1O0hT5UOjaNF9DkCVcBRQiJ=s96-c",
      "totalTime": 0,
      "averageTime": 0,
      "cumulativeProjectDates": {},
      "projects": []
    },
    {
      "globalView": true,
      "userId": 7,
      "userName": "Akshay Samarth",
      "userAvatar": "https://lh3.googleusercontent.com/a/AGNmyxY5ptU1qdygBGZRjg4sBboATdR99y2U8PK01YqLQA=s96-c",
      "totalTime": 0,
      "averageTime": 0,
      "cumulativeProjectDates": {},
      "projects": [
        {
          "clientName": "Acme Inc.",
          "projectId": 30,
          "projectName": "Testing Project",
          "totalTime": 0,
          "allocations": {}
        }
      ]
    },
    {
      "globalView": true,
      "userId": 11,
      "userName": "Allwyn S",
      "userAvatar": "https://lh3.googleusercontent.com/a/AGNmyxZyH4MJeVOTbT1GdqThKznlL7sl33MYRoyWERc0=s96-c",
      "totalTime": 0,
      "averageTime": 0,
      "cumulativeProjectDates": {},
      "projects": [
        {
          "clientName": "ABC Corp",
          "projectId": 1,
          "projectName": "Maintenance",
          "totalTime": 0,
          "allocations": {}
        },
        {
          "clientName": "Bored Co.",
          "projectId": 2,
          "projectName": "Launch",
          "totalTime": 0,
          "allocations": {}
        }
      ]
    },
    {
      "globalView": true,
      "userId": 1,
      "userName": "Anurag Banerjee",
      "userAvatar": "https://lh3.googleusercontent.com/a/AGNmyxYeBWJJ-MYM4iVXmBQRV3Ds0opnXlJFR-6TMdojOQ=s96-c",
      "totalTime": 0,
      "averageTime": 0,
      "cumulativeProjectDates": {},
      "projects": [
        {
          "clientName": "ABC Corp",
          "projectId": 1,
          "projectName": "Maintenance",
          "totalTime": 0,
          "allocations": {}
        },
        {
          "clientName": "Bored Co.",
          "projectId": 2,
          "projectName": "Launch",
          "totalTime": 0,
          "allocations": {}
        }
      ]
    },
    {
      "globalView": true,
      "userId": 9,
      "userName": "Kashif A",
      "userAvatar": "https://lh3.googleusercontent.com/a/AGNmyxYt3lNytPM20fXPMr0JDUxOWKvkR_U86NiJ4cJ-=s96-c",
      "totalTime": 0,
      "averageTime": 0,
      "cumulativeProjectDates": {},
      "projects": []
    },
    {
      "globalView": true,
      "userId": 5,
      "userName": "Niraj S",
      "userAvatar": "https://lh3.googleusercontent.com/a/AGNmyxaQ9UoMTq1Vxgvht0QcHnzl_4XtY4zYa30v2-vg=s96-c",
      "totalTime": 0,
      "averageTime": 0,
      "cumulativeProjectDates": {},
      "projects": [
        {
          "clientName": "ABC Corp",
          "projectId": 1,
          "projectName": "Maintenance",
          "totalTime": 0,
          "allocations": {}
        },
        {
          "clientName": "Bored Co.",
          "projectId": 2,
          "projectName": "Launch",
          "totalTime": 0,
          "allocations": {}
        }
      ]
    },
    {
      "globalView": true,
      "userId": 4,
      "userName": "Rudolph G",
      "userAvatar": "https://lh3.googleusercontent.com/a/AGNmyxbaBz9vxLZkyGA4NYuh65XpOvCOecLhUECYEKHvDQ=s96-c",
      "totalTime": 0,
      "averageTime": 0,
      "cumulativeProjectDates": {},
      "projects": []
    },
    {
      "globalView": true,
      "userId": 2,
      "userName": "Sumeet U",
      "userAvatar": "https://lh3.googleusercontent.com/a/AGNmyxblBETtCtXe2fWEkS5FXtVBmY9pvYZDzq652czz=s96-c",
      "totalTime": 0,
      "averageTime": 0,
      "cumulativeProjectDates": {},
      "projects": []
    },
    {
      "globalView": true,
      "userId": 3,
      "userName": "Vipin Y",
      "userAvatar": "https://lh3.googleusercontent.com/a/AGNmyxY9qwTkRP57Rzg-qa1Dir2ldj874DHyD1Vf27xY=s96-c",
      "totalTime": 0,
      "averageTime": 0,
      "cumulativeProjectDates": {},
      "projects": [
        {
          "clientName": "ABC Corp",
          "projectId": 1,
          "projectName": "Maintenance",
          "totalTime": 0,
          "allocations": {}
        },
        {
          "clientName": "Bored Co.",
          "projectId": 2,
          "projectName": "Launch",
          "totalTime": 0,
          "allocations": {}
        }
      ]
    }
  ]

  const getFormatedData = (timeArr:any)=>{
    const resultObj:any = {};
    for(let x in timeArr) {
      const date = Date.parse(x);
      resultObj[date]=timeArr[x];
    }
    return resultObj
  }

  const dataFiltering = (data: any) => {
    const resultantArray: any = [];
    const notEmptyArr = data.filter((user: any) => user?.userName);
    notEmptyArr.map((user: any) => {
      const temp = { id: user?.userId, name: user?.userName, userAvatar: user?.userAvatar,time:getFormatedData(user?.cumulativeProjectDates) }
      resultantArray.push(temp);
      user?.projects?.length && user?.projects?.map((project: any) => {
        const temp = { id: project?.projectId, name: project?.projectName, clientName: project?.clientName, totalTime: project?.totalTime, userName: user.userName }
        resultantArray.push(temp);
      })
    });
    return resultantArray;
  }

  const endDate = dayjs().toDate();
  const startDate = dayjs().add(-14, "day").toDate();

  const options = {
    team,
    startDate,
    endDate,
    page: 1,
    pageSize: 20,
  };

  const allocation = await getAllocations(options);
  allocation.map((obj)=>console.log(obj.projects))

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Assignments" text="This is a summary current assignments"></DashboardHeader>
        <div className="container mx-auto">
          <DataTable data={dataFiltering(allocation)
          } />
        </div>
      </DashboardShell>
    </>
  );
}
