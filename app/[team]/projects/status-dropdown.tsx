import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Archive, ArchiveRestore, MoreVertical, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { PopoverClose } from "@radix-ui/react-popover";
import { EditProjectForm } from "@/components/forms/projectForm";
import { interval } from "date-fns";

interface StatusDropdownProps {
  id: number;
  status: string;
  clients: any;
  users: any;
  team: any;
  projectDetails: ProjectDetails;
}

interface UpdateProjectStatusResponse {
  status: string;
}

interface ProjectDetails {
  id: number;
  budget: number | undefined;
  team: string;
  name: string | null | undefined;
  clientId: number;
  owner: string | null;
  interval: number;
  billable: boolean;
}

const StatusDropdown = ({ id, status, clients, users, team, projectDetails }: StatusDropdownProps) => {
  const params = useParams();
  const router = useRouter();

  const updateProjectStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/team/project/status`, {
        method: "PUT",
        body: JSON.stringify({
          team: params.team,
          projectId: id,
          status: status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        router.refresh();
        toast.message(`Project ${data.status === "PUBLISHED" ? "unarchived" : "archived"}`);
        return;
      }

      console.error("Something went wrong", data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" className="h-0 border-none bg-transparent p-3" title="More" variant="ghost">
            <MoreVertical height={16} width={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 text-sm" align="end">
          <PopoverClose asChild>
            <Button size="sm" variant="ghost" onClick={() => updateProjectStatus(id, status)}>
              {status === "PUBLISHED" ? (
                <Archive size={16} className="mr-2" />
              ) : (
                <ArchiveRestore size={16} className="mr-2" />
              )}
              {status === "PUBLISHED" ? "Archive" : "Unarchive"}
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            {<EditProjectForm clients={clients} users={users} team={team} projectDetails={projectDetails} />}

          </PopoverClose>
        </PopoverContent>
      </Popover>
  );
};

export default StatusDropdown;
