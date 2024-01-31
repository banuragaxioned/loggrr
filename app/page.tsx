import { getCurrentUser } from "@/server/session";
import { HeroSection } from "./hero";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { FeaturesSection } from "./features";
import { SiteFooter } from "./site-footer";

export const metadata = {
  title: "Loggr - Time tracking made simple",
};

export default async function Home() {
  const user = await getCurrentUser();
  const teams = user?.workspaces;

  if (!teams) {
    redirect("/thanks");
  }

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <div className="mx-auto flex h-[20rem] w-full max-w-2xl flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-center">Join the waitlist</h1>
        <p>
          We want to make time tracking and team collaboration &quot;syncing up&quot; simple. Whether you&apos;re an
          digital agency, work with freelancers, or need to track time for your own projects, we&apos;ve got you
          covered.
        </p>
        <Input type="text" placeholder="hello@loggr.dev" />
      </div>
      <SiteFooter />
    </>
  );
}
