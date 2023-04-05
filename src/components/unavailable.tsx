import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Unavailable() {
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>Page unavailable</h2>
        <p>
          The link you are trying to reach is currently unavailable. Please check if you are using the correct link. If
          your page has not appeared again in 5-10 minutes then please contact our support team.
        </p>
        <div className="flex gap-4">
          <Link href="/help" rel="noreferrer" className={buttonVariants({ size: "lg" })}>
            Contact
          </Link>
          <Link rel="noreferrer" href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
