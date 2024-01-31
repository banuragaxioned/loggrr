import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center">Built by Axioned with ❤️ from 🇮🇳</p>
        </div>
        <Link href={"mailto:hello@loggr.dev"} className={buttonVariants({ variant: "outline", size: "sm" })}>
          Contact
        </Link>
      </div>
    </footer>
  );
}
