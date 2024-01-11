import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Unavailable() {
  return (
    <section>
      <h1>Page unavailable</h1>
      <p>
        The link you are trying to reach is currently unavailable. Please check if you are using the correct link. If
        your page has not appeared again in 5-10 minutes then please contact our support team.
      </p>
      <div className="mt-2 flex gap-4">
        <Link href="mailto:loggr@axioned.com" rel="noreferrer" className={buttonVariants({ size: "lg" })}>
          Contact
        </Link>
        <Link rel="noreferrer" href="/" className={buttonVariants({ variant: "default", size: "lg" })}>
          Back to home
        </Link>
      </div>
    </section>
  );
}
