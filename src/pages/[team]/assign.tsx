import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";

export default function GlobalAssign() {
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
        <h2>Global Assignment</h2>
        <div className="todo h-14">Global Assignment</div>
      </section>
    </div>
  );
}
