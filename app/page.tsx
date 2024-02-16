import { HeroSection } from "@/components/marketing/hero";
import { FeaturesSection } from "@/components/marketing/features";
import { SiteFooter } from "@/components/marketing/site-footer";
import { JoinWatchlist } from "@/components/marketing/join-waitlist";
import SendEmail from "./email/sendEmail";
import Email from "./email/email";

export const metadata = {
  title: "Loggr - Time tracking made simple",
};

export default async function Home() {
  return (
    <div className="container selection:bg-foreground selection:text-background">
      {/* <SendEmail /> */}
      <Email userFirstname="Zishan" />
      <HeroSection />
      <FeaturesSection />
      <JoinWatchlist />
      <SiteFooter />
    </div>
  );
}
