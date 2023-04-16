import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";

export default function TenantBilling() {
  const { isLoading, isInvalid } = useValidateTeamAccess();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>Billing</h2>
        <div className="todo h-14">Billing</div>
      </section>
    </div>
  );
}
