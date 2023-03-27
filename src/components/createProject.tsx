import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { ErrorMessage } from '@hookform/error-message';
import { ProjectInterval } from "@prisma/client";


export default function CreateProject() {
  const router = useRouter();
  const currentTenant = router.query.team as string;

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
      name: 'project 1', //getValues("project_name"),
      clientId: 1,
      interval: ProjectInterval.MONTHLY,
      slug: 'axioned',//currentTenant,
      startdate: new Date(),
    });
    console.log(getValues("project_name"));
    return newProject;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder="Project name"
        className="peer peer-invalid:bg-pink-600"
        {...register("project_name", { required: 'This field is required', maxLength: 10 })}
      />
      { errors.project_name && <p className="peer-invalid:visible text-pink-600 text-sm">
        <ErrorMessage errors={errors} name="project_name" />
      </p> }
      
      <Input
        type="text"
        placeholder="Client name"
        className="peer peer-invalid:bg-pink-600"
        {...register("client_name", { required: 'This field is required', maxLength: 10 })}
      />
      { errors.client_name && <p className="peer-invalid:visible text-pink-600 text-sm">
        <ErrorMessage errors={errors} name="client_name" />
      </p> }

      <Button type="submit">Submit</Button>
    </form>
  );
}
