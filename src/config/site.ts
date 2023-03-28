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
    help: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Loggr",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    // {
    //   title: "Home",
    //   href: "/",
    // },
  ],
  links: {
    help: "mailto:loggr@axioned.com",
  },
};
