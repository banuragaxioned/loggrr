import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function TenantSettings() {
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
        <h2>Settings</h2>
        <div className="todo h-14">Settings</div>
      </section>
    </div>
  );
}
