import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { ErrorMessage } from "@hookform/error-message";

export default function CreateClient() {
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
    addClient();
    reset();
  };

  console.log(`Errors: `, errors);

  const createClient = api.client.createClient.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const addClient = () => {
    const newClient = createClient.mutate({
      name: getValues("client_name"),
      slug: currentTenant,
    });
    console.log(getValues("client_name"));
    return newClient;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder="Client name"
        className="peer peer-invalid:bg-pink-600"
        {...register("client_name", {
          required: "Please enter a client name",
          maxLength: 20,
        })}
      />
      {errors.client_name && (
        <p className="text-sm text-pink-600 peer-invalid:visible">
          <ErrorMessage errors={errors} name="client_name" />
        </p>
      )}

      <Button type="submit">Submit</Button>
    </form>
  );
}
