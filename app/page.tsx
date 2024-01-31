import { HeroSection } from "./hero";
import { FeaturesSection } from "./features";
import { SiteFooter } from "./site-footer";
import { JoinWatchlist } from "./join-waitlist";

export const metadata = {
  title: "Loggr - Time tracking made simple",
};

export default async function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <JoinWatchlist />
      <SiteFooter />
    </>
  );
}
