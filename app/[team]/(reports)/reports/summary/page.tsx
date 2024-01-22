import type { Metadata } from "next";
import { ChevronDown, Plus, Upload } from "lucide-react";

import { pageProps } from "@/types";
import { getProjectSummary } from "@/server/services/project";

import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: `Summary`,
};

const allDropdowns = [
  {
    id: 1,
    title: "Month",
  },
  {
    id: 2,
    title: "My Projects",
  },
  {
    id: 3,
    title: "CFM +1 more",
  },
  {
    id: 4,
    title: "Billable",
  },
];

export default async function Page({ params }: pageProps) {
  const { team } = params;
  const data = await getProjectSummary(team);
  const selected = false; // Fake selected

  const renderDropdowns =
    Array.isArray(allDropdowns) &&
    allDropdowns.map((dropdown) => (
      <li key={dropdown.id}>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className={`${selected ? "bg-violet-200 text-violet-800 hover:bg-violet-100 hover:text-violet-700 dark:bg-violet-900/20 dark:text-white dark:hover:bg-violet-400/20" : ""}`}
          >
            <Button variant="outline" className="flex gap-2">
              {dropdown.title} <ChevronDown size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuItem>
              <span>Option 1</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Option 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Option 3</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    ));

  return (
    <DashboardShell>
      <DashboardHeader heading="Report Page" />
      {/* Top Card */}
      <Card className="flex justify-between p-4 shadow-none">
        {/* Left Area */}
        <ul className="flex gap-2">
          {renderDropdowns}
          <li>
            <Button variant="outline" size="icon">
              <Plus />
            </Button>
          </li>
        </ul>
        {/* Right Area */}
        <div>
          <Button variant="outline" className="flex gap-2">
            <Upload size={16} />
            Export
          </Button>
        </div>
      </Card>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </DashboardShell>
  );
}
