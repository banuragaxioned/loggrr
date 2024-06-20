import type { Dispatch } from "react";
import type { LucideIcon } from "lucide-react";
import type { Workspace, Role, Status } from "@prisma/client";
import type { ColumnDef, Table } from "@tanstack/react-table";

export interface UserProfile {
  name: string | null;
  id: number;
  image: string;
}

export interface NavLink {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
}

export interface DashboardConfig {
  mainNav: MainNavItem[];
  sidebarTeam: SidebarNavItem[];
  sidebarProjects: SidebarNavItem[];
  sidebarSkills: SidebarNavItem[];
  sidebarReports: SidebarNavItem[];
  sidebarProfile: SidebarNavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export interface AllocationDates {
  [date: string]: {
    id: number;
    billableTime: number;
    nonBillableTime: number;
    totalTime: number;
    updatedAt: Date;
    frequency?: string;
  };
}

export interface ProjectAllocation {
  globalView: boolean;
  clientName: string;
  projectId: number;
  projectName: string;
  users: {
    userId: number;
    userName: string | null;
    userAvatar: string;
    averageTime: number;
    allEntries: number;
    allocations: AllocationDates;
  }[];
}

export interface Summary {
  id: number;
  name: string;
  clientId: number;
  clientName: string;
  billable: boolean;
  projectOwner: string | null;
  projectOwnerAvatar: string | null;
  budget: number;
  logged: number;
}

export interface SkillScore {
  id: number;
  name: string;
  value: number;
}

export type SkillRadar = SkillScore[];

export interface ProjectInterval {}

export interface ComboboxOptions {
  id: number;
  name?: string | null;
}

export interface AllProjectsWithMembers {
  id: number;
  name?: string | null;
  users: ComboboxOptions[];
}

export interface AssignFormValues {
  date: Date;
  billableTime: number;
  nonBillableTime: number;
  projectId: number;
  userId: number;
  enddate?: Date;
}

export interface AllUsersWithAllocation {
  id: number;
  name?: string | null;
}

export interface UserGroup {
  id: number;
  name: string;
}

export interface Members {
  id: number;
  name?: string;
  email: string;
  image?: string;
  status: Status;
  role: Role;
  userGroup: UserGroup[];
  projectId: number;
}

export interface pageProps {
  params: { team: Workspace["slug"]; project?: number };
  searchParams: Record<string, string>;
}

export interface projectProps {
  params: { project: Workspace["slug"]; team: Workspace["slug"] };
}

export interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export interface AllocationDetails {
  billable: boolean;
  clientName: string;
  id: number;
  name: string;
  team: string;
  timeAssigned: AllocationDates[];
  title: string;
  userId: number;
  userName: string;
}

export interface Assignment {
  name: string;
  image: string | null;
  userId: number;
  userName: string;
  title: string;
  subRows: AllocationDetails[] | undefined;
  skills?: Skills[];
  usergroup: UserGroup[];
}

interface Skills {
  level: number;
  skill: string;
}

export interface Client {
  id: number;
  name: string;
  status: Status;
  project: number;
}

export interface Project {
  billable?: boolean;
  id: number;
  name: string;
  milestone?: Milestone[];
  task?: Milestone[];
  client?: Milestone;
  workspace?: string;
  uuid?: string;
}

export interface TimeEntryProperties {
  id: number;
  milestone: Milestone | null;
  task: Milestone | null;
  comments: string | null;
  billable: boolean;
  time: number;
}

interface ProjectLog {
  project: Project;
  total: number;
  data: TimeEntryProperties[];
}

export interface TimeEntryData {
  dayTotal: number;
  projectsLog: ProjectLog[];
}

export interface TimeEntryDataObj {
  dayTotal?: number;
  projectsLog?: ProjectLog[];
}

export interface Milestone {
  id: number;
  name: string;
  billable?: boolean;
}

export interface GetSetDateProps {
  date: Date;
  setDate: Dispatch<Date> | any;
}
