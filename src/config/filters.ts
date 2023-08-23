import { Icons } from "@/components/icons";

export const statuses = [
  {
    value: "ACTIVE",
    label: "Active",
    icon: Icons.activity,
  },
  {
    value: "INACTIVE",
    label: "Archived",
    icon: Icons.archive,
  },
  {
    value: "DELETED",
    label: "Deleted",
    icon: Icons.delete,
  },
];

export const roles = [
  {
    value: "OWNER",
    label: "Owner",
    icon: Icons.user,
  },
  {
    value: "MANAGER",
    label: "Manager",
    icon: Icons.user,
  },
  {
    value: "USER",
    label: "User",
    icon: Icons.user,
  },
];

export const clientStatuses = [
  {
    value: "PUBLISHED",
    label: "Published",
    icon: Icons.activity,
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    icon: Icons.archive,
  },
];

export const entryOptions = [
  {
    value: "billable",
    label: "Billable",
    icon: Icons.billing,
  },
  {
    value: "nonBillable",
    label: "Non Billable",
    icon: Icons.milestone,
  },
]

export const viewOptions = [
  {
    value: "week",
    label: "Week",
    icon: Icons.activity,
  },
  {
    value: "weekDays",
    label: "Week Days",
    icon: Icons.archive,
  },
]
