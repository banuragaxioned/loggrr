import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { ErrorMessage } from "@hookform/error-message";
import { ProjectInterval } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function CreateProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const clientList = api.client.getClients.useQuery(
    { text: currentTenant },
    { enabled: session?.user !== undefined }
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const onSubmit = (data: any) => {
    addProject();
    reset();
  };

  console.log(`Errors: `, errors);

  const createProject = api.project.createProject.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const addProject = () => {
    const newProject = createProject.mutate({
      name: "project 1", //getValues("project_name"),
      clientId: 1,
      interval: ProjectInterval.MONTHLY,
      slug: "axioned", //currentTenant,
      startdate: new Date(),
    });
    console.log(getValues("project_name"));
    return newProject;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder="Enter your Project name"
        {...register("project_name", {
          required: "This field is required",
        })}
        maxLength={20}
      />
      {errors.project_name && (
        <p className="text-sm text-red-600">
          <ErrorMessage errors={errors} name="project_name" />
        </p>
      )}

      <select {...register("interval", { required: true })}>
        {ProjectInterval &&
          Object.keys(ProjectInterval).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
      </select>
      {errors.interval && (
        <p className="text-sm text-red-600">
          <ErrorMessage errors={errors} name="client_name" />
        </p>
      )}

      <select {...register("client_name", { required: true })}>
        {clientList &&
          clientList.data?.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
      </select>
      {errors.client_name && (
        <p className="text-sm text-red-600">
          <ErrorMessage errors={errors} name="interval" />
        </p>
      )}

      {/* TODO: Start date */}
      {/* TODO: Optional: End date */}

      <Button type="submit">Submit</Button>
    </form>
  );
}
