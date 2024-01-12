import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/server/session";
import { PartyPopper } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Launchpad",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const teams = user?.workspaces;

  if (!teams) {
    return (
      <div className="container flex flex-col items-center justify-center gap-12">
        <Card className="flex flex-col items-center justify-center space-y-4 p-12">
          <PartyPopper className="h-12 w-12 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Thank you!</h2>
          <p>You have successfully signed up to express your interest in our application.</p>
          <p>Please note that our app is invite-only.</p>
          <p>We will send you an invitation as soon as possible.</p>
          <Link href="mailto:loggr@axioned.com" rel="noreferrer" className={buttonVariants({ size: "lg" })}>
            Get in touch
          </Link>
        </Card>
      </div>
    );
  }

  if (teams.length === 1) {
    redirect("/" + teams[0].slug);
  }

  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-12">
        <h2>
          Welcome back, <span>{user?.name}</span> 👋
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {user?.workspaces.map((team) => (
            <Link
              className="hover:bg-zinc/20 flex max-w-xs flex-col gap-4 rounded-xl bg-zinc-400/10 p-4  hover:bg-zinc-400/20"
              href={team.slug}
              key={team.id}
            >
              <h3>{team.name}</h3>
              <div className="text-lg">
                The application lives here. Right now, its only layouts and static components.
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
