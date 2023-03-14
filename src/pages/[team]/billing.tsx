import { useSession, getSession } from "next-auth/react";

export default function TenantBilling() {
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
        <h2>Billing</h2>
        <div className="todo h-14">Billing</div>
      </section>
    </div>
  );
}
