import Link from "next/link";
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";
import { useRouter } from "next/router";
import { QuickStatsWidget } from "@/components/quickStats";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function Dashboard() {
  const router = useRouter();
  const { isLoading, isInvalid, isReady, slug } = useValidateTenantAccess();

  const { register, handleSubmit, reset, getValues } = useForm({
    shouldUseNativeValidation: true,
  });

  const projectList = api.project.getProjects.useQuery(
    { text: slug },
    { enabled: isReady }
  );

  const addTimeEntry = api.timelog.addTimelog.useMutation({
    onSuccess: (data) => {
      // refetchMembers();
    },
  });

  const addTimeEntryHandler = (data: any) => {
    console.log(data);
    const newTimeEntry = addTimeEntry.mutate({
      date: new Date().toISOString(),
      projectId: 1,
      billable: true,
      comments: "test",
      milestoneId: 1,
      taskId: 1,
      slug: slug,
      time: "1.5",
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
        <div className="todo h-20">Add Time Combobox</div>
        <span className="todo h-80">
          <form onSubmit={handleSubmit(addTimeEntryHandler)}>
            <Input type="date" placeholder="date" name="date"></Input>
            <Input type="text" placeholder="hours" name="hours"></Input>
            <Input type="text" placeholder="projectId" name="projectId"></Input>
            <Input type="text" placeholder="clientId" name="clientId"></Input>
            <Input type="checkbox" placeholder="billable" name="billable" />
            <Input type="text" placeholder="comments" name="comments" />
            <button
              type="submit"
              // onClick={(e) => {
              //   e.preventDefault();
              // }}
            >
              Submit
            </button>
          </form>
        </span>
      </section>
      <section className="hidden lg:block lg:basis-1/4">
        <QuickStatsWidget />
      </section>
    </div>
  );
}
