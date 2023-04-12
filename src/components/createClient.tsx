import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import useToast from "@/hooks/useToast";

export default function CreateClient() {
  const router = useRouter();
  const currentTeam = router.query.team as string;
  const showToast = useToast();

  const { register, handleSubmit, reset, getValues } = useForm({
    shouldUseNativeValidation: true,
  });
  // TODO: Update the forms to be "smart", see reference: https://react-hook-form.com/advanced-usage/#SmartFormComponent

  const onSubmit = (data: any) => {
    addClient();
  };

  const createClient = api.client.createClient.useMutation({
    onSuccess: (data) => {
      reset();
      showToast("A new Client was created", "success");
    },
  });

  const addClient = () => {
    const newClient = createClient.mutate({
      name: getValues("client_name"),
      slug: currentTeam,
    });
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
