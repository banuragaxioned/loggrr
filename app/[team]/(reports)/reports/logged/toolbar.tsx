"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Briefcase, Calendar, CircleDollarSign, Download, FolderCog, ListRestart, Printer, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Assignment, DataTableToolbarProps } from "@/types";

import { Button } from "@/components/ui/button";
import DropdownFilters from "./dropdown-filter";
import MultiSelectFilter from "./multiselect-filters";
import { ClientAndUserInterface } from "./data-table";

interface DataTableToolbarExtendedProps<Assignment> extends DataTableToolbarProps<Assignment> {
  allClients: ClientAndUserInterface[];
  allUsers: ClientAndUserInterface[];
  handlePrintClick: () => void;
  handleExportClick: () => void;
}

const monthFilter = {
  title: "Month",
  searchable: false,
  icon: <Calendar size={16} />,
  options: [
    { id: 0, title: "This Month", link: "" },
    { id: 1, title: "Last 3 Months", link: "last3" },
    { id: 2, title: "Last 6 Months", link: "last6" },
    { id: 3, title: "Last 1 Year", link: "last12" },
  ],
};

const projectFilter = {
  title: "Projects",
  searchable: false,
  icon: <FolderCog size={16} />,
  options: [
    { id: 0, title: "All Projects", link: "" },
    { id: 1, title: "My Projects", link: "my" },
    { id: 2, title: "Active Projects", link: "active" },
    { id: 4, title: "Archived Projects", link: "archived" },
  ],
};

export function DataTableToolbar<TData>({
  table,
  allClients,
  allUsers,
  handlePrintClick,
  handleExportClick,
}: DataTableToolbarExtendedProps<Assignment>) {
  const searchParams = useSearchParams();
  const selectedMonth = searchParams.get("month");
  const selectedBilling = searchParams.get("billable");
  const selectedProject = searchParams.get("project");
  const selectedClients = searchParams.get("clients");
  const selectedMembers = searchParams.get("members");

  const clientFilter = {
    title: "Clients",
    searchable: true,
    icon: <Briefcase size={16} />,
    options: allClients,
  };

  const peopleFilter = {
    title: "Members",
    searchable: true,
    icon: <Users size={16} />,
    options: allUsers,
  };

  const isResetButtonVisibile =
    selectedMonth || selectedBilling || selectedProject || selectedClients || selectedMembers;

  const generateBillingQuery = () => {
    if (!selectedBilling) return { text: "Hours", nextValue: "true" };
    if (selectedBilling === "true") return { text: "Billable", nextValue: "false" };
    if (selectedBilling === "false") return { text: "Non-Billable", nextValue: "" };
  };

  // Billing status toggle button
  const billingStatusToggleButton = (
    <Button className="flex gap-1.5" variant="outline" asChild size="sm">
      <Link
        href={`?${new URLSearchParams({
          month: selectedMonth ?? "",
          project: selectedProject ?? "",
          clients: selectedClients ?? "",
          members: selectedMembers ?? "",
          billable: generateBillingQuery()?.nextValue ?? "",
        })}`}
      >
        <CircleDollarSign
          size={18}
          className={cn(
            selectedBilling === "true" && "text-success hover:text-success focus:bg-success/10",
            selectedBilling === "false" && "text-slate-400",
            !selectedBilling && "text-black dark:text-white",
          )}
        />
        {generateBillingQuery()?.text}
      </Link>
    </Button>
  );

  return (
    <div className="mb-4 flex items-center justify-between gap-x-3 rounded-xl border border-dashed p-2">
      {/* Left Area */}
      <ul className="flex flex-wrap items-center gap-2">
        {/* Months */}
        <li>
          <DropdownFilters values={monthFilter} />
        </li>
        {/* Projects */}
        <li>
          <DropdownFilters values={projectFilter} />
        </li>
        <li>
          <MultiSelectFilter values={clientFilter} />
        </li>
        <li>
          <MultiSelectFilter values={peopleFilter} />
        </li>
        {/* Billing Status */}
        <li>{billingStatusToggleButton}</li>
        <li className="no-print">
          {isResetButtonVisibile && (
            <Button variant="ghost" size="sm" className="flex gap-1.5" asChild>
              <Link href={`?`}>
                Reset
                <ListRestart size={16} />
              </Link>
            </Button>
          )}
        </li>
      </ul>
      {/* Right Area */}
      <div className="no-print flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" className="flex gap-2" onClick={handlePrintClick} title="Print">
          <Printer size={16} />
        </Button>
        {/* <Button variant="outline" size="sm" className="flex gap-2" onClick={handleExportClick} title="Export">
          <Download size={16} />
          Export CSV
        </Button> */}
      </div>
    </div>
  );
}
