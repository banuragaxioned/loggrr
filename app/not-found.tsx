import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Unavailable() {
  return (
    <section className="mx-auto max-w-(--breakpoint-xl) p-2 text-center">
      <h1 className="mb-4">Page unavailable</h1>
      <p className="mx-auto max-w-3xl">
        The link you are trying to reach is currently unavailable. Please check if you are using the correct link. If
        your page has not appeared again in 5-10 minutes then please contact our support team.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="mailto:loggr@axioned.com" rel="noreferrer">
            Contact
          </Link>
        </Button>
        <Button asChild variant="default" size="sm">
          <Link rel="noreferrer" href="/">
            Back to home
          </Link>
        </Button>
      </div>
    </section>
  );
}
