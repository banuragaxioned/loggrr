import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { ProjectInterval } from "@prisma/client";
import { useSession } from "next-auth/react";
import useToast from "@/hooks/useToast";

export default function CreateProject() {
  const { data: session } = useSession();
  const router = useRouter();
  const currentTeam = router.query.team as string;
  const showToast = useToast();

  const { data: clientList } = api.client.getClients.useQuery(
    { text: currentTeam },
    { enabled: session?.user !== undefined }
  );

  const { register, handleSubmit, reset, getValues } = useForm({
    shouldUseNativeValidation: true,
  });
  // TODO: Update the forms to be "smart", see reference: https://react-hook-form.com/advanced-usage/#SmartFormComponent

  const onSubmit = (data: any) => {
    addProject();
  };

  const createProject = api.project.createProject.useMutation({
    onSuccess: (data) => {
      reset();
      showToast("A new Project was created", "success");
    },
  });

  const addProject = () => {
    const newProject = createProject.mutate({
      name: getValues("project_name"),
      clientId: Number(getValues("client")),
      interval: getValues("interval"),
      slug: currentTeam,
      startdate: new Date(getValues("startdate")),
      enddate: getValues("enddate") ? new Date(getValues("enddate")) : undefined,
      billable: getValues("billable"),
    });
    return newProject;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder="Enter your Project name"
        {...register("project_name", { required: true })}
        maxLength={20}
      />
      <div className="flex gap-2">
        <select required {...register("interval", { required: true })} defaultValue="">
          <option value="" disabled>
            Select Interval
          </option>
          {ProjectInterval &&
            Object.keys(ProjectInterval).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
        </select>

        <select required {...register("client", { required: true })} defaultValue="">
          <option value="" disabled>
            Select Client
          </option>
          {clientList &&
            clientList.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Input type="date" {...register("startdate", { required: true })} />
        <Input type="date" {...register("enddate")} />
      </div>

      <div className="my-2 space-x-2">
        <label htmlFor="billable">Billable</label>
        <input type="checkbox" {...register("billable")} className="rounded" />
      </div>

      <Button type="submit" className="my-2">
        Submit
      </Button>
    </form>
  );
}
