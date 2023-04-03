import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

export default function Project() {
  const router = useRouter();
  const { isLoading, isInvalid, isReady, pid } = useValidateTenantAccess();

  const milestonesList = api.milestone.getMilestones.useQuery(
    { pid },
    { enabled: isReady }
  );

  const tasksList = api.task.getTasks.useQuery({ pid }, { enabled: isReady });

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
          {milestonesList.data?.map((milestone) => (
            <li key={milestone.id}>{milestone.name}</li>
          ))}
        </ul>
        <h4>Create a new milestone</h4>
        <span>Form comes here</span>
        <h3>Tasks</h3>
        <ul>
          {tasksList.data?.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
        <h4>Create a new task</h4>
        <span>Form comes here</span>
      </section>
    </div>
  );
}
