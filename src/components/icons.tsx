import dynamic from "next/dynamic";

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
  Settings,
  CreditCard,
  Check,
  ChevronsUpDown,
  Boxes,
  Loader,
  FileText,
  LucideProps,
} from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

const Icon = ({ name, color, size }: IconProps) => {
  const LucideIcon = dynamic(dynamicIconImports[name]);

  return <LucideIcon color={color} size={size} />;
};

export default Icon;

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  team: Boxes,
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
  check: Check,
  select: ChevronsUpDown,
  spinner: Loader,
};
