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
  name: "Loggr",
  description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
  url: "https://loggr-app.vercel.app",
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

export const reportConfig: ReportingConfig[] = [
  {
    name: "Logged",
    description: "Explore the time logged by your and the team.",
    path: "/logged",
  },
  {
    name: "Assigned",
    description: "Find out who is assigned to what.",
    path: "/assigned",
  },
  {
    name: "Available",
    description: "Find out who is available to work.",
    path: "/available",
  },
];
