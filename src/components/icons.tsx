import {
  Laptop,
  Moon,
  SunMedium,
  Clock,
  HelpCircle,
  SearchIcon,
  Folder,
  Rocket,
  List,
  MessageSquare,
  User,
  ArrowRight,
  type Icon as LucideIcon,
  Settings,
  CreditCard,
  FileText,
} from "lucide-react";

import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

export type Icon = LucideIcon;

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  logo: Clock,
  help: HelpCircle,
  search: SearchIcon,
  project: Folder,
  milestone: Rocket,
  task: List,
  comment: MessageSquare,
  dollar: CurrencyDollarIcon,
  user: User,
  arrowRight: ArrowRight,
  settings: Settings,
  billing: CreditCard,
  post: FileText,
};
