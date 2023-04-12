import Link from "next/link";
import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import { LoggedRatio, Insights, Metrics, QuickStatsWidget } from "@/components/quickStats";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { cleanDate } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function Dashboard() {
  const { isLoading, isInvalid, isReady, slug, path } = useValidateTeamAccess();

  const { register, getValues } = useForm({
    shouldUseNativeValidation: true,
  });

  const selectDate = cleanDate(getValues("date") ? new Date(getValues("date")) : new Date());
  const { data: getMyTimeLog, refetch: refetchMyTimeLog } = api.timelog.getMyTimeLog.useQuery(
    { slug: slug, date: selectDate },
    { enabled: isReady }
  );

  // const projectList = api.project.getProjects.useQuery({ text: slug }, { enabled: isReady });
  // const milestoneList = api.milestone.getMilestones.useQuery({ pid: getValues("projectId") }, { enabled: isReady });
  // const taskList = api.task.getTasks.useQuery({ pid: getValues("projectId") }, { enabled: isReady });

  const onTimeEntrySubmit = (data: any) => addTimeEntryHandler(data);

  const addTimeEntry = api.timelog.addTimelog.useMutation({
    onSuccess: (data) => {
      refetchMyTimeLog();
    },
  });

  const addTimeEntryHandler = (data: any) =>
    addTimeEntry.mutate({
      date: cleanDate(new Date(getValues("date"))),
      projectId: +getValues("projectId"),
      milestoneId: +getValues("milestoneId"),
      taskId: +getValues("taskId"),
      slug: slug,
      time: getValues("time"),
      billable: getValues("billable"),
      comments: getValues("comments"),
    });

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
          <Link href={path + "/projects"}>Project List</Link>
          <Link href={path + "/members"}>Members</Link>
          <Link href={path + "/skills"}>Skills</Link>
          <Link href={path + "/assign"}>Assign</Link>
          <Link href={path + "/reports"}>Reports</Link>
          <Link href={path + "/billing"}>Billing</Link>
          <Link href={path + "/manage"}>Manage</Link>
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
          <ul>
            {getMyTimeLog?.map((timeLog) => (
              <li key={timeLog.id}>
                {timeLog.Project.name}/{timeLog.Milestone.name}/{timeLog.Task?.name} - {timeLog.time}m{" "}
                {timeLog.billable ? <span>🟢</span> : <span>🔴</span>} {timeLog.comments}
              </li>
            ))}
          </ul>
        </span>
      </section>
      <section className="hidden space-y-4 lg:block lg:basis-1/4">
        <LoggedRatio />
        <Metrics />
        <Insights />
        <QuickStatsWidget />
      </section>
    </div>
  );
}
