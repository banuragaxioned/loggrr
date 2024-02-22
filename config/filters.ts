import { Activity, Archive, Building, Home, MapPin, MinusCircle, User, User2 } from "lucide-react";

export const roles = [
  {
    value: "OWNER",
    label: "Owner",
    icon: User,
  },
  {
    value: "MANAGER",
    label: "Manager",
    icon: User,
  },
  {
    value: "USER",
    label: "User",
    icon: User,
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    icon: MinusCircle,
  },
];

export const weekOptions = [
  { id: 0, name: "Full Week", value: "fullWeek" },
  { id: 1, name: "Work week", value: "workWeek" },
];

export const hoursTypeOptions = [
  { id: 0, name: "Billable", value: "billableTime" },
  { id: 1, name: "Non-billable", value: "nonBillableTime" },
  { id: 2, name: "All Entries", value: "allEntries" },
];

export const clientStatuses = [
  {
    value: "PUBLISHED",
    label: "Published",
    icon: Activity,
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    icon: Archive,
  },
];

export const locationOptions = [
  { label: "Work From Home", value: "Work from Home", icon: Home },
  { label: "Office", value: "Office", icon: Building },
  { label: "Client Location", value: "Client Location", icon: MapPin },
  { label: "On Duty", value: "On Duty", icon: User2 },
];
