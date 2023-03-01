import { useSession, getSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section className="lg:basis-3/4"></section>
      <section className="hidden lg:block lg:basis-1/4"></section>
    </div>
  );
}
