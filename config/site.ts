export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
}
interface SiteConfig {
  name: string;
  description: string;
  mainNav: NavItem[];
  url: string;
  links: {
    help: string;
  };
}

interface ReportingConfig {
  name: string;
  description: string;
  path: string;
}

export const siteConfig: SiteConfig = {
  name: "Loggrr",
  description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
  url: "https://loggrr.com",
  mainNav: [
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "Members",
      href: "/manage/members",
    },
    {
      title: "Skills",
      href: "/skills",
    },
  ],
  links: {
    help: "mailto:loggr@axioned.com",
  },
};

// routes that don't need nav menu
export const excludedNavRoutes = ["/", "/thanks", "/manage", "/manage/appearance", "/manage/notifications"];
