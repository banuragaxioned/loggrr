"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, startOfDay, startOfMonth, startOfToday } from "date-fns";
import { Briefcase, CircleDollarSign, Download, FolderCog, ListRestart, Loader2, Printer, Users } from "lucide-react";
import { useQueryState } from "nuqs";
import csvDownload from "json-to-csv-export";

import { cn } from "@/lib/utils";
import { Assignment, DataTableToolbarProps } from "@/types";
import useLocale from "@/hooks/useLocale";

import { Button } from "@/components/ui/button";
import MultiSelectFilter from "./multiselect-filters";
import { ClientAndUserInterface } from "./data-table";
import { CustomTooltip } from "@/components/custom/tooltip";
import { DateRangePicker } from "@/components/custom/date-range-picker";

interface DataTableToolbarExtendedProps<Assignment> extends DataTableToolbarProps<Assignment> {
  allClients: ClientAndUserInterface[];
  allUsers: ClientAndUserInterface[];
  handlePrintClick: () => void;
  hasFullAccess?: boolean;
}

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
  hasFullAccess,
}: DataTableToolbarExtendedProps<Assignment>) {
  const [isExportLoading, setIsExportLoading] = useState(false);

  const { team: slug } = useParams();
  const locale = useLocale();

  const [selectedRange, setSelectedRange] = useQueryState("range");
  const [selectedBilling, setSelectedBilling] = useQueryState("billable");
  const [selectedProject, setSelectedProject] = useQueryState("project");
  const [selectedClients, setSelectedClients] = useQueryState("clients");
  const [selectedMembers, setSelectedMembers] = useQueryState("members");

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
    selectedRange || selectedBilling || selectedProject || selectedClients || selectedMembers;

  const generateBillingQuery = () => {
    if (!selectedBilling) return { text: "Hours", nextValue: "true" };
    if (selectedBilling === "true") return { text: "Billable", nextValue: "false" };
    if (selectedBilling === "false") return { text: "Non-Billable", nextValue: "" };
  };

  const handleExportClick = async () => {
    try {
      setIsExportLoading(true);
      const response = await fetch("/api/team/export", {
        method: "POST",
        body: JSON.stringify({
          slug,
          selectedRange,
          selectedBilling,
          selectedProject: Array.isArray(selectedProject) ? selectedProject.join(",") : selectedProject,
          selectedClients: Array.isArray(selectedClients) ? selectedClients.join(",") : selectedClients,
          selectedMembers: Array.isArray(selectedMembers) ? selectedMembers.join(",") : selectedMembers,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const currentTime = format(new Date(), "dd-MM-yyyy (hh﹕mm a)");
      const filename = `Logged Report ${currentTime}.csv`;

      const dataToConvert = {
        data,
        filename,
        delimiter: ",",
        headers: ["Client", "Project", "User", "Category", "Task", "Date", "Comment", "Time logged", "Billing type"],
      };

      csvDownload(dataToConvert);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    } finally {
      setIsExportLoading(false);
    }
  };

  const updateDateRange = (range: string) => {
    setSelectedRange(range || null);
  };

  const [start, end] = selectedRange?.split(",") || [];
  const startFrom = (start && startOfDay(new Date(start))) || startOfMonth(startOfToday());
  const endTo = (end && startOfDay(new Date(end))) || startOfToday();

  // Billing status toggle button
  const billingStatusToggleButton = (
    <Button
      className="flex gap-1.5"
      variant="outline"
      size="sm"
      onClick={() => setSelectedBilling(generateBillingQuery()?.nextValue || null)}
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
    </Button>
  );

  const handleReset = () => {
    setSelectedRange(null);
    setSelectedBilling(null);
    setSelectedProject(null);
    setSelectedClients(null);
    setSelectedMembers(null);
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-x-3 rounded-xl border border-dashed p-2">
      {/* Left Area */}
      <ul className="flex flex-wrap items-center gap-2">
        {/* Months */}
        <li>
          <DateRangePicker
            onUpdate={(values) => {
              const start = format(values.range.from, "MM-dd-yyyy");
              const end = format(values.range.to ?? startOfToday(), "MM-dd-yyyy");
              const range = `${start},${end}`;
              updateDateRange(range);
            }}
            initialDateFrom={startFrom}
            initialDateTo={endTo}
            locale={locale}
            key={selectedRange}
          />
        </li>
        {/* Projects TODO: To work on this later */}
        {/* <li>
          <DropdownFilters values={projectFilter} />
        </li> */}
        {hasFullAccess && (
          <>
            <li>
              <MultiSelectFilter values={clientFilter} />
            </li>
            <li>
              <MultiSelectFilter values={peopleFilter} />
            </li>
          </>
        )}
        {/* Billing Status */}
        <li>{billingStatusToggleButton}</li>
        <li className="print:hidden">
          {isResetButtonVisibile && (
            <Button variant="ghost" size="sm" className="flex gap-1.5" onClick={handleReset}>
              Reset
              <ListRestart size={16} />
            </Button>
          )}
        </li>
      </ul>
      {/* Right Area */}
      <div className="no-print flex flex-wrap items-center justify-end gap-2">
        <CustomTooltip
          trigger={
            <Button variant="outline" size="icon" className="flex gap-2" onClick={handlePrintClick}>
              <Printer size={16} />
            </Button>
          }
          content="Print"
        />
        <CustomTooltip
          trigger={
            <Button
              disabled={isExportLoading}
              variant="outline"
              size="icon"
              className="flex gap-2"
              onClick={handleExportClick}
            >
              {isExportLoading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
            </Button>
          }
          content="Export CSV"
        />
      </div>
    </div>
  );
}
