import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";
import { TimeEntryData } from "@/types";

const clientCreateSchema = z.object({
  team: z.string().min(1),
  project: z.number(),
  milestone: z.number(),
  time: z.number(),
  comments: z.string().min(1),
  billable: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = clientCreateSchema.parse(json);

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    if (user.tenants.filter((tenant) => tenant.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }
    //schema goes here

    const timeEntry = await db.timeEntry.create({
      data: {
        time: body?.time,
        comments: body?.comments,
        milestoneId: body?.milestone,
        userId: user.id,
        projectId: body?.project,
        date: new Date(),
        tenantId: user.tenants.filter((tenant) => tenant.slug === body.team)[0].id,
      },
    });

    return new Response(JSON.stringify(timeEntry));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}


export async function GET(req:Request) {

  const searchParams = new URL(req.url).searchParams;
  const team = searchParams.get("team");
  const date = searchParams.get("date");

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    
    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    if (user.tenants.filter((tenant) => tenant.slug === team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }
    //schema goes here
    const response = await db.timeEntry.findMany({
      where:{
        userId:user.id,
        // date:date ? date :"",
        Tenant:{
          slug:team ? team : ""
        }
      },
      select:{
       id:true,
       billable:true,
       comments:true,
       Project:{
         select:{
          id:true,
          name:true
         }
       },
       Milestone:{
        select:{
          id:true,
          name:true
        }
       },
       taskId:true,
       time:true,
       date:true
      },
      orderBy:{
        projectId:"asc"
      },
    });

  const restructuredData = response.reduce((prev:Array<TimeEntryData>,current)=>{
    const project = {...current?.Project};
    const data = {id:current?.id,billable:current?.billable,time:current?.time,milestone:current?.Milestone,comments:current?.comments};
    let index  =  prev.findIndex((obj)=>obj?.project?.id === project?.id );
    if(index > -1){
      prev[index]?.data.push(data);
      prev[index].total+=current?.time;
    } else prev?.push({project:current?.Project,data:[data],total:current?.time});

    return prev;
    },[])

    return new Response(JSON.stringify(restructuredData));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
