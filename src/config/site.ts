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

interface PageMetadataConfig {
  title: string;
  description: string;
  path: string;
}

interface ReportPages {
  summary: PageMetadataConfig;
  assigned: PageMetadataConfig;
  logged: PageMetadataConfig;
  available: PageMetadataConfig;
}

interface SkillPages {
  explore: PageMetadataConfig;
  report: PageMetadataConfig;
  setting: PageMetadataConfig;
  summary: PageMetadataConfig;
}

interface TeamPages {
  clients: PageMetadataConfig;
  projects: PageMetadataConfig;
}

interface ProjectPages {
  manage: PageMetadataConfig;
}

interface ManagePages {
  manage: PageMetadataConfig;
  members: PageMetadataConfig;
}

export const siteConfig: SiteConfig = {
  name: "Loggr",
  description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
  url: "https://loggr.dev",
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
    {
      title: "Reports",
      href: "/reports",
    },
  ],
  links: {
    help: "mailto:loggr@axioned.com",
  },
};

export const reportConfig: ReportPages = {
  summary: {
    title: "Summary",
    description: "Explore the time logged by your and the team.",
    path: "/summary",
  },
  logged: {
    title: "Logged",
    description: "Explore the time logged by your and the team.",
    path: "/logged",
  },
  assigned: { title: "Assigned", description: "Find out who is assigned to what.", path: "/assigned" },
  available: {
    title: "Available",
    description: "Find out who is available to work.",
    path: "/available",
  },
};

export const teamConfig: TeamPages = {
  clients: {
    title: "Clients",
    description: "Find out who is available to work.",
    path: "/clients",
  },
  projects: {
    title: "Projects",
    description: "Find out who is available to work.",
    path: "/projects",
  },
};

export const projectConfig: ProjectPages = {
  manage: {
    title: "Manage",
    description: "Find out who is available to work.",
    path: "/manage",
  },
};

export const manageConfig: ManagePages = {
  manage: {
    title: "Manage",
    description: "Find out who is available to work.",
    path: "/members",
  },
  members: {
    title: "Members",
    description: "Find out who is available to work.",
    path: "/members",
  },
};

export const skillConfig: SkillPages = {
  explore: {
    title: "Explore",
    description: "Find out who is available to work.",
    path: "/explore",
  },
  report: {
    title: "Report",
    description: "Find out who is available to work.",
    path: "/report",
  },
  setting: {
    title: "Settings",
    description: "Find out who is available to work.",
    path: "/setting",
  },
  summary: {
    title: "Summary",
    description: "Find out who is available to work.",
    path: "/summary",
  },
};
