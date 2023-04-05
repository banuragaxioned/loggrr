import { Input } from "@/components/ui/input";
import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";

export default function ManageProfile() {
  const { isLoading, isInvalid, isReady } = useValidateTenantAccess();
  const { register, getValues } = useForm({
    shouldUseNativeValidation: true,
  });

  const { data: userProfileInfo, refetch: refetchProfileInfo } = api.profile.getProfile.useQuery();

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
            <Input {...register("name")} value={userProfileInfo.name!} required />
            <Input value={userProfileInfo.email} disabled />
            <select {...register("timezone")}>
              <option value="1">1 </option>
            </select>
            <p>{userProfileInfo.timezone}</p>
            <button onClick={() => refetchProfileInfo()}>Refetch Profile Info</button>
          </div>
        )}
      </section>
    </div>
  );
}
