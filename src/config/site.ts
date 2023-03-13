export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
}
interface SiteConfig {
  name: string;
  description: string;
  mainNav: NavItem[];
  links: {
    twitter: string;
    docs: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Loggr",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Tenant",
      href: "/tenant",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    docs: "https://ui.shadcn.com",
  },
};
