import { SiteHeader } from "@/components/site-header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex flex-col space-y-6">
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
}
