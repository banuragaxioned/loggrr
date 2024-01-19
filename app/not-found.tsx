import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Unavailable() {
  return (
    <section className="mx-auto max-w-screen-xl p-2 text-center">
      <h1 className="mb-4">Page unavailable</h1>
      <p className="mx-auto max-w-3xl">
        The link you are trying to reach is currently unavailable. Please check if you are using the correct link. If
        your page has not appeared again in 5-10 minutes then please contact our support team.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Link
          href="mailto:loggr@axioned.com"
          rel="noreferrer"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Contact
        </Link>
        <Link rel="noreferrer" href="/" className={buttonVariants({ variant: "default", size: "lg" })}>
          Back to home
        </Link>
      </div>
    </section>
  );
}
