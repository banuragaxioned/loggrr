import {
  BarChart3,
  Briefcase,
  CircleDollarSign,
  ClipboardCheck,
  Cloud,
  Code2,
  Cog,
  Database,
  FileText,
  FlaskConical,
  FolderKanban,
  Headphones,
  HeartHandshake,
  Kanban,
  Megaphone,
  Package,
  Palette,
  Scale,
  Server,
  Shield,
  TrendingUp,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

interface GroupIconRule {
  keywords: string[];
  icon: LucideIcon;
}

// Order matters: more specific keywords should appear first.
export const GROUP_ICON_RULES: GroupIconRule[] = [
  {
    keywords: ["quality assurance", "quality", "qa", "q/a", "testing", "test", "assurance"],
    icon: ClipboardCheck,
  },
  {
    keywords: ["account", "accounts", "finance", "financial", "billing", "payroll", "bookkeeping", "bookkeep"],
    icon: CircleDollarSign,
  },
  {
    keywords: ["management", "executive", "leadership", "admin", "administration"],
    icon: Briefcase,
  },
  {
    keywords: ["engineer", "engineering", "development", "developer", "software", "tech", "technology"],
    icon: Code2,
  },
  {
    keywords: ["design", "creative", "ui", "ux", "brand"],
    icon: Palette,
  },
  {
    keywords: ["marketing", "growth", "campaign"],
    icon: Megaphone,
  },
  {
    keywords: ["sales", "business development", "bd"],
    icon: TrendingUp,
  },
  {
    keywords: ["hr", "human resources", "people", "talent", "recruiting", "recruitment"],
    icon: UsersRound,
  },
  {
    keywords: ["customer success", "client success"],
    icon: HeartHandshake,
  },
  {
    keywords: ["support", "helpdesk", "help desk", "service desk"],
    icon: Headphones,
  },
  {
    keywords: ["production"],
    icon: Cog,
  },
  {
    keywords: ["product"],
    icon: Package,
  },
  {
    keywords: ["data", "analytics", "bi", "insights", "reporting"],
    icon: BarChart3,
  },
  {
    keywords: ["database", "dba"],
    icon: Database,
  },
  {
    keywords: ["security", "infosec", "cyber"],
    icon: Shield,
  },
  {
    keywords: ["legal", "compliance", "governance"],
    icon: Scale,
  },
  {
    keywords: ["operations", "ops", "operational"],
    icon: Cog,
  },
  {
    keywords: ["research", "r&d", "innovation"],
    icon: FlaskConical,
  },
  {
    keywords: ["project management", "pmo", "pm"],
    icon: Kanban,
  },
  {
    keywords: ["project", "delivery"],
    icon: FolderKanban,
  },
  {
    keywords: ["devops", "sre", "infrastructure", "platform", "cloud"],
    icon: Cloud,
  },
  {
    keywords: ["server", "systems", "it"],
    icon: Server,
  },
  {
    keywords: ["content", "copywriting", "documentation", "docs"],
    icon: FileText,
  },
];

function matchesKeyword(name: string, keyword: string): boolean {
  const normalized = name.toLowerCase().trim();

  if (keyword.includes(" ")) {
    return normalized.includes(keyword);
  }

  return normalized.split(/[\s-_]+/).some((word) => word === keyword || word.startsWith(keyword));
}

export function getGroupIcon(name: string): LucideIcon {
  for (const rule of GROUP_ICON_RULES) {
    if (rule.keywords.some((keyword) => matchesKeyword(name, keyword))) {
      return rule.icon;
    }
  }

  return Users;
}
