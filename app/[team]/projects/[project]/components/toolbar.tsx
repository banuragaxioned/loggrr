"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { format, startOfDay, startOfMonth, startOfToday, subDays } from "date-fns";
import { Briefcase, CircleDollarSign, Download, FolderCog, ListRestart, Loader2, Printer, Users } from "lucide-react";
import csvDownload from "json-to-csv-export";

import { cn } from "@/lib/utils";
import { Assignment, DataTableToolbarProps } from "@/types";
import useLocale from "@/hooks/useLocale";

import { Button } from "@/components/ui/button";
// import DropdownFilters from "./dropdown-filter";
// import MultiSelectFilter from "./multiselect-filters";
import { ClientAndUserInterface } from "./data-table";
import { CustomTooltip } from "@/components/custom/tooltip";
import { DateRangePicker } from "@/components/custom/date-range-picker";

interface DataTableToolbarExtendedProps<Assignment> extends DataTableToolbarProps<Assignment> {
  allClients: ClientAndUserInterface[];
  allUsers: ClientAndUserInterface[];
  handlePrintClick: () => void;
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

export function DataTableToolbar({ isBillable }: { isBillable: boolean }) {
  const [isExportLoading, setIsExportLoading] = useState(false);

  const { team: slug } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const selectedRange = searchParams.get("range");
  const selectedBilling = searchParams.get("billable");
  // const selectedProject = searchParams.get("project");
  // const selectedClients = searchParams.get("clients");
  // const selectedMembers = searchParams.get("members");

  // const clientFilter = {
  //   title: "Clients",
  //   searchable: true,
  //   icon: <Briefcase size={16} />,
  //   options: allClients,
  // };

  // const peopleFilter = {
  //   title: "Members",
  //   searchable: true,
  //   icon: <Users size={16} />,
  //   options: allUsers,
  // };

  const isResetButtonVisibile = selectedRange || selectedBilling;
  // || selectedProject || selectedClients || selectedMembers;

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
          // selectedBilling,
          // selectedProject,
          // selectedClients,
          // selectedMembers,
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

      // csvDownload(dataToConvert);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    } finally {
      setIsExportLoading(false);
    }
  };

  // Update the URL with the new selectedOptions
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const updateDateRange = (range: string) => {
    router.push(pathname + "?" + createQueryString("range", range));
  };

  const [start, end] = selectedRange?.split(",") || [];
  const startFrom = (start && startOfDay(new Date(start))) || subDays(startOfToday(), 30);
  const endTo = (end && startOfDay(new Date(end))) || startOfToday();

  // Billing status toggle button
  const billingStatusToggleButton = (
    <Button className="flex gap-1.5" variant="outline" asChild size="sm">
      <Link
        href={`?${new URLSearchParams({
          range: selectedRange ?? "",
          // project: selectedProject ?? "",
          // clients: selectedClients ?? "",
          // members: selectedMembers ?? "",
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
        {/* <li>
          <MultiSelectFilter values={clientFilter} />
        </li>
        <li>
          <MultiSelectFilter values={peopleFilter} />
        </li> */}
        {/* Billing Status */}
        {isBillable && <li>{billingStatusToggleButton}</li>}
        <li className="print:hidden">
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
      <div className="no-print flex flex-wrap items-center justify-end gap-2">
        {/* <CustomTooltip
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
        /> */}
      </div>
    </div>
  );
}
