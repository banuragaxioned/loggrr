import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Project() {
  const router = useRouter();
  const { isLoading, isInvalid, isReady, pid, slug } = useValidateTenantAccess();

  const { register, getValues, reset } = useForm();

  const onMilestoneSubmit = (data: any) => {
    addMilestoneHandler(data);
  };

  const { data: milestonesList, refetch: refetchMilestones } = api.milestone.getMilestones.useQuery(
    { pid },
    { enabled: isReady }
  );

  const newMilestoneMutation = api.milestone.addMilestone.useMutation({
    onSuccess: (data) => {
      refetchMilestones();
      reset();
    },
  });

  const addMilestoneHandler = (data: any) => {
    const newMilestone = newMilestoneMutation.mutate({
      name: getValues("milestone_name"),
      budget: +getValues("milestone_budget"),
      startdate: getValues("startdate") ? new Date(getValues("startdate")) : undefined,
      enddate: getValues("enddate") ? new Date(getValues("enddate")) : undefined,
      slug: slug,
      pid: +pid,
    });
  };

  const onTaskSubmit = (data: any) => {
    addTaskHandler(data);
  };

  const { data: tasksList, refetch: refetchTasks } = api.task.getTasks.useQuery({ pid }, { enabled: isReady });

  const newTaskMutation = api.task.addTask.useMutation({
    onSuccess: (data) => {
      refetchTasks();
      reset();
    },
  });

  const addTaskHandler = (data: any) => {
    const newTask = newTaskMutation.mutate({
      name: getValues("task_name"),
      budget: +getValues("task_budget"),
      slug: slug,
      pid: +pid,
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
      <section>
        <h2>Project {pid}</h2>
        <Link href={router.asPath + "/manage"}>Manage</Link>
        <h3>Milestones</h3>
        <ul>
          {milestonesList?.map((milestone) => (
            <li key={milestone.id}>{milestone.name}</li>
          ))}
        </ul>
        <h4>Create a new milestone</h4>
        <form onSubmit={onMilestoneSubmit}>
          <Input
            type="text"
            placeholder="Enter your milestone name"
            {...register("milestone_name")}
            maxLength={20}
            required
          />
          <Input type="number" placeholder="Enter your budget" {...register("milestone_budget")} defaultValue={0} />

          <div className="flex gap-2">
            <Input type="date" {...register("startdate")} defaultValue={""} />
            <Input type="date" {...register("enddate")} defaultValue={""} />
          </div>

          <Button type="button" className="my-2" onClick={addMilestoneHandler}>
            Submit
          </Button>
        </form>
        <h3>Tasks</h3>
        <ul>
          {tasksList?.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
        <h4>Create a new task</h4>
        <form onSubmit={onTaskSubmit}>
          <Input type="text" placeholder="Enter your task name" {...register("task_name")} maxLength={20} required />
          <Input type="number" placeholder="Enter your budget" {...register("task_budget")} defaultValue={0} />
          <Button type="button" className="my-2" onClick={addTaskHandler}>
            Submit
          </Button>
        </form>
      </section>
    </div>
  );
}
