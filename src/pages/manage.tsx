import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";

export default function ManageProfile() {
  const { isLoading, isInvalid } = useValidateTenantAccess();
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
      </section>
    </div>
  );
}
