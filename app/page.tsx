import { HeroSection } from "@/components/marketing/hero";
import { FeaturesSection } from "@/components/marketing/features";
import { SiteFooter } from "@/components/marketing/site-footer";
import { JoinWatchlist } from "@/components/marketing/join-waitlist";

export const metadata = {
  title: "Loggrr - Time tracking made simple",
};

export default async function Home() {
  return (
    <div className="container selection:bg-foreground selection:text-background">
      <HeroSection />
      <FeaturesSection />
      <JoinWatchlist />
      <SiteFooter />
    </div>
  );
}
