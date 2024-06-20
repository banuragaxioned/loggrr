import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function ThankYou() {
  return (
    <div className="container flex flex-col items-center justify-center gap-4">
      <PartyPopper className="h-12 w-12 text-primary" />
      <h1>Thank you!</h1>
      <p>You have successfully signed up to express your interest in our application.</p>
      <p>We will send you an invitation as soon as possible.</p>
      <Link href="mailto:loggr@axioned.com" rel="noreferrer" className={buttonVariants({ size: "lg" })}>
        Get in touch
      </Link>
    </div>
  );
}
