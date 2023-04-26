import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { MainNav } from "@/components/main-nav";
import { UserAccountNav } from "@/components/user-account";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <>
      <header className="container sticky top-0 z-40 mx-auto flex h-16 w-full items-center space-x-4 border-b border-b-zinc-200 bg-white px-4 dark:border-b-zinc-700 dark:bg-zinc-950 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href={siteConfig.links.help} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                  className: "text-zinc-700 dark:text-zinc-400",
                })}
              >
                <Icons.help className="h-5 w-5" />
                <span className="sr-only">Help</span>
              </div>
            </Link>
            <ThemeToggle />
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
            />
          </nav>
        </div>
      </header>
      <div className="container mx-auto w-full items-center p-4">{children}</div>
    </>
  );
}
