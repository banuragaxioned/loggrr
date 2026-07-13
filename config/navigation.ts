import {
  BarChart2,
  Building2,
  CalendarDays,
  FolderKanban,
  Group,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  slug: string;
  icon: LucideIcon;
  denyAccess: string[];
}

export interface NavItem {
  title: string;
  icon: LucideIcon;
  items: NavSubItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Projects",
    icon: FolderKanban,
    items: [
      {
        title: "Projects",
        slug: "projects",
        icon: FolderKanban,
        denyAccess: ["GUEST"],
      },
      {
        title: "Clients",
        slug: "clients",
        icon: Building2,
        denyAccess: ["GUEST"],
      },
    ],
  },
  {
    title: "Members",
    icon: Users,
    items: [
      {
        title: "Manage Members",
        slug: "members",
        icon: Users,
        denyAccess: ["GUEST"],
      },
      {
        title: "Groups",
        slug: "groups",
        icon: Group,
        denyAccess: ["GUEST"],
      },
    ],
  },
  {
    title: "Reports",
    icon: BarChart2,
    items: [
      {
        title: "Logged",
        slug: "reports/logged",
        icon: BarChart2,
        denyAccess: [""],
      },
      {
        title: "Leaves",
        slug: "reports/leaves",
        icon: CalendarDays,
        denyAccess: ["GUEST"],
      },
    ],
  },
];
