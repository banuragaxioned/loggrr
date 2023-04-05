import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import soft from "timezone-soft";

export default function ManageProfile() {
  const { isLoading, isInvalid } = useValidateTenantAccess();

  const { data: userProfileInfo, refetch: refetchProfileInfo } = api.profile.getProfile.useQuery();

  const { register, getValues, reset } = useForm({
    shouldUseNativeValidation: true,
  });

  const updateUserProfile = api.profile.updateProfile.useMutation({
    onSuccess: (data) => {
      refetchProfileInfo();
      reset();
    },
  });

  const updateProfileHandler = (data: any) =>
    updateUserProfile.mutate({
      name: getValues("name"),
      timezone: soft(getValues("timezone"))[0].iana,
    });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>Manage Profile</h2>
        <div className="todo h-14">Profile Settings</div>
        {userProfileInfo && (
          <div>
            <p>Profile Info</p>
            <form onSubmit={updateProfileHandler}>
              <Input {...register("name")} value={userProfileInfo.name!} required />
              <Input value={userProfileInfo.email} disabled />
              <Input {...register("timezone")} defaultValue={userProfileInfo.timezone} required />
              <Button type="button" onClick={updateProfileHandler}>
                Submit
              </Button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
