import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import useToast from "@/hooks/useToast";
import { api } from "@/lib/api";
import { AllocationFrequency } from "@prisma/client";
import { useForm } from "react-hook-form";

export default function GlobalAssign() {
  const showToast = useToast();
  const { isLoading, isInvalid, currentTeam, isReady } = useValidateTeamAccess();

  const { register, handleSubmit, reset, getValues } = useForm({ shouldUseNativeValidation: true });

  const onSubmit = (data: any) => {
    addAssignment();
  };

  const { data: projectList } = api.project.getProjects.useQuery({ slug: currentTeam }, { enabled: isReady });
  const { data: teamMembers } = api.tenant.getTeamMembers.useQuery({ slug: currentTeam }, { enabled: isReady });

  const createAllocation = api.allocation.createAllocation.useMutation({
    onSuccess: (data) => {
      reset();
      showToast("A new Assignment was created", "success");
    },
  });
  const addAssignment = () => {
    const newAssignment = createAllocation.mutate({
      projectId: Number(getValues("project")),
      userId: Number(getValues("user")),
      frequency: getValues("frequency"),
      date: new Date(getValues("date")),
      enddate: getValues("enddate") ? new Date(getValues("enddate")) : undefined,
      slug: currentTeam,
      billableTime: Number(getValues("billable_time")),
      nonBillableTime: Number(getValues("nonbillable_time")),
    });
    return newAssignment;
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
        <h2>Global Assignment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <select required {...register("project", { required: true })} defaultValue="">
            <option value="" disabled>
              Select Project
            </option>
            {projectList?.length &&
              projectList.map((key) => (
                <option key={key.id} value={key.id}>
                  {key.name}
                </option>
              ))}
          </select>

          <select required {...register("user", { required: true })} defaultValue="">
            <option value="" disabled>
              Select User
            </option>
            {teamMembers?.length &&
              teamMembers.map((key) => (
                <option key={key.id} value={key.id}>
                  {key.name}
                </option>
              ))}
          </select>

          <select required {...register("frequency", { required: true })} defaultValue="">
            <option value="" disabled>
              Select Allocation Frequency
            </option>
            {AllocationFrequency &&
              Object.keys(AllocationFrequency).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
          </select>

          <Input type="date" placeholder="Start date" {...register("date")} required />

          <Input type="date" placeholder="End date" {...register("end_date")} />

          <Input required defaultValue={0} type="number" placeholder="Billable time" {...register("billable_time")} />

          <Input
            required
            defaultValue={0}
            type="number"
            placeholder="Non-billable time"
            {...register("nonbillable_time")}
          />

          <Button type="submit" className="my-2">
            Submit
          </Button>
        </form>
      </section>
    </div>
  );
}
