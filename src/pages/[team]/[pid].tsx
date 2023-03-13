import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Project() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { pid } = router.query;
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <div className="todo h-14">Project Details page</div>
      </section>
    </div>
  );
}
