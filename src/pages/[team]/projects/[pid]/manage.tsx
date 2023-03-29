import Unavailable from "@/components/unavailable";
import { useValidateTenantAccess } from "@/hooks/useTenant";

export default function ManageProject() {
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
        <h2>Manage Project</h2>
        <div className="todo h-14">Settings</div>
      </section>
    </div>
  );
}
