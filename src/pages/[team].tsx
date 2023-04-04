import Link from "next/link";
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";
import { useRouter } from "next/router";
import { QuickStatsWidget } from "@/components/quickStats";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { date } from "zod";

export default function Dashboard() {
  const router = useRouter();
  const { isLoading, isInvalid, isReady, slug } = useValidateTenantAccess();

  const { register, handleSubmit, reset, getValues } = useForm({
    shouldUseNativeValidation: true,
  });

  const projectList = api.project.getProjects.useQuery({ text: slug }, { enabled: isReady });

  const onTimeEntrySubmit = (data: any) => {
    console.log(data);
    addTimeEntryHandler(data);
  };
  const addTimeEntry = api.timelog.addTimelog.useMutation({
    onSuccess: (data) => {
      // refetchMembers();
    },
  });

  const addTimeEntryHandler = (data: any) => {
    console.log(data);
    const newTimeEntry = addTimeEntry.mutate({
      date: new Date(getValues("date")),
      projectId: +getValues("projectId"),
      milestoneId: +getValues("milestoneId"),
      taskId: +getValues("taskId"),
      slug: slug,
      time: getValues("time"),
      billable: getValues("billable"),
      comments: getValues("comments"),
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }

  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section className="lg:basis-3/4">
        <div className="flex gap-4">
          <Link href={router.asPath + "/projects"}>Project List</Link>
          <Link href={router.asPath + "/members"}>Members</Link>
          <Link href={router.asPath + "/skills"}>Skills</Link>
          <Link href={router.asPath + "/assign"}>Assign</Link>
          <Link href={router.asPath + "/reports"}>Reports</Link>
          <Link href={router.asPath + "/billing"}>Billing</Link>
          <Link href={router.asPath + "/settings"}>Settings</Link>
        </div>
        <div className="flex gap-4"></div>
        <div className="todo h-14">Calendar</div>
        <div className="todo">
          <form onSubmit={onTimeEntrySubmit} className="grid grid-cols-4">
            <Input type="date" {...register("date")} defaultValue={""} required />
            <Input type="number" placeholder="projectId" {...register("projectId")} required />
            <Input type="number" placeholder="milestoneId" {...register("milestoneId")} required />
            <Input type="number" placeholder="taskId" {...register("taskId")} />
            <Input type="text" placeholder="Hours" {...register("time")} />
            <div className="my-2 space-x-2">
              <label htmlFor="billable">Billable</label>
              <input type="checkbox" {...register("billable")} className="rounded" />
            </div>
            <Input type="text" placeholder="What did you do?" {...register("comments")} />
            <Button type="button" onClick={addTimeEntryHandler}>
              Submit
            </Button>
          </form>
        </div>
        <span>
          <h3>Your time log</h3>
        </span>
      </section>
      <section className="hidden lg:block lg:basis-1/4">
        <QuickStatsWidget />
      </section>
    </div>
  );
}
