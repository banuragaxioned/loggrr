import dynamic from "next/dynamic";

import {
  Laptop,
  Moon,
  SunMedium,
  Clock,
  Trash,
  HelpCircle,
  Archive,
  PlusCircle,
  Activity,
  SearchIcon,
  Folder,
  Rocket,
  List,
  MessageSquare,
  ListRestart,
  User,
  BoxesIcon,
  ArrowRight,
  Settings,
  CreditCard,
  Check,
  Cross,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
  EyeOff,
  Boxes,
  CircleDollarSign,
  Loader,
  FileText,
  MinusCircle,
  LucideProps,
  Edit,
  Save,
  CalendarDays,
  MoreVertical,
} from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

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
  archive: Archive,
  reset: ListRestart,
  activity: Activity,
  add: PlusCircle,
  delete: Trash,
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
  dollar: CircleDollarSign,
  user: User,
  group: BoxesIcon,
  arrowRight: ArrowRight,
  settings: Settings,
  billing: CreditCard,
  post: FileText,
  check: Check,
  cross: Cross,
  selectUp: ChevronUp,
  selectDown: ChevronDown,
  select: ChevronsUpDown,
  spinner: Loader,
  eyeOff: EyeOff,
  chevronRight: ChevronRight,
  chevronDoubleRight: ChevronsRight,
  chevronLeft: ChevronLeft,
  chevronDoubleLeft: ChevronsLeft,
  chevronDown: ChevronDown,
  minusCircle: MinusCircle,
  edit: Edit,
  save: Save,
  calendar: CalendarDays,
  more: MoreVertical,
};
