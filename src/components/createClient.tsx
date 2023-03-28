import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import useToast from "@/hooks/useToast";

export default function CreateClient() {
  const router = useRouter();
  const currentTenant = router.query.team as string;
  const showToast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ shouldUseNativeValidation: true });

  const onSubmit = (data: any) => {
    addClient();
    reset();
    showToast("A new Client was created", "success");
  };

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
        {...register("client_name", {
          required: "Please enter a client name",
          maxLength: 15,
        })}
      />
      <Button type="submit" className="my-2">
        Submit
      </Button>
    </form>
  );
}
