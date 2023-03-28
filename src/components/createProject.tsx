import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { ErrorMessage } from "@hookform/error-message";
import { ProjectInterval } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentTenant = router.query.team as string;

  const { data: clientList } = api.client.getClients.useQuery(
    { text: currentTenant },
    {
      enabled: session?.user !== undefined,
      onSuccess: (data) => console.log(data),
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ shouldUseNativeValidation: true });

  const onSubmit = (data: any) => {
    console.log(data);
    addProject();
  };

  const createProject = api.project.createProject.useMutation({
    onSuccess: (data) => {
      console.log(data);
      reset();
    },
  });

  const addProject = () => {
    const newProject = createProject.mutate({
      name: getValues("project_name"),
      clientId: Number(getValues("client")),
      interval: getValues("interval"),
      slug: currentTenant,
      startdate: new Date(getValues("startdate")),
      enddate: getValues("enddate")
        ? new Date(getValues("enddate"))
        : undefined,
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

      <select
        required
        {...register("interval", { required: true })}
        defaultValue=""
      >
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

      <select
        required
        {...register("client", { required: true })}
        defaultValue=""
      >
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

      <input type="date" {...register("startdate", { required: true })} />
      <input type="date" {...register("enddate")} />

      <Button type="submit">Submit</Button>
    </form>
  );
}
