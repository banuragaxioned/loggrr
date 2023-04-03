import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { get, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";

export default function Project() {
  const router = useRouter();
  const { isLoading, isInvalid, isReady, pid, slug } =
    useValidateTenantAccess();

  const { data: tasksList, refetch: refetchTasks } = api.task.getTasks.useQuery(
    { pid },
    { enabled: isReady }
  );

  const onSubmit = (data: any) => {
    console.log(data);
    addMilestoneHandler(data);
  };

  const { data: milestonesList, refetch: refetchMilestones } =
    api.milestone.getMilestones.useQuery({ pid }, { enabled: isReady });

  const newMilestoneMutation = api.milestone.addMilestone.useMutation({
    onSuccess: (data) => {
      refetchMilestones();
    },
  });

  const addMilestoneHandler = (data: any) => {
    const newMilestone = newMilestoneMutation.mutate({
      name: data.milestone_name,
      budget: data.budget,
      startDate: data.startdate,
      endDate: data.enddate,
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
        <Form onSubmit={onSubmit}>
          <Input
            type="text"
            placeholder="Enter your milestone name"
            name="milestone_name"
            maxLength={20}
            required
          />
          <Input
            type="number"
            placeholder="Enter your budget"
            name="budget"
            defaultValue={0}
          />

          <div className="flex gap-2">
            <Input type="date" name="startdate" />
            <Input type="date" name="enddate" />
          </div>

          <Button type="submit" className="my-2">
            Submit
          </Button>
        </Form>
        <h3>Tasks</h3>
        <ul>
          {tasksList?.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
        <h4>Create a new task</h4>
        <span>Form comes here</span>
      </section>
    </div>
  );
}
