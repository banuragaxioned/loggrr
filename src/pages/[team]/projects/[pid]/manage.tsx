import { useSession, getSession } from "next-auth/react";

export default function ManageProject() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>Manage Projects</h2>
        <div className="todo h-14">Manage Projects</div>
      </section>
    </div>
  );
}
