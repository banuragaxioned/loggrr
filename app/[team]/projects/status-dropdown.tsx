import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Archive, ArchiveRestore, Edit, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { PopoverClose } from "@radix-ui/react-popover";
import { useSession } from "next-auth/react";
import { checkAccess } from "@/lib/helper";

const StatusDropdown = ({ id, status }: { id: number; status: string }) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const userRole = session?.user?.workspaces?.find((workspace) => workspace.slug === params.team)?.role;
  const isAdmin = !checkAccess(userRole ?? "GUEST", ["MANAGER", "OWNER"]);

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
      <PopoverContent className="flex w-auto flex-col items-start overflow-hidden p-0 text-sm" align="end">
        <PopoverClose asChild>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => updateProjectStatus(id, status)}
            className="w-full justify-start"
          >
            {status === "PUBLISHED" ? <Archive size={16} /> : <ArchiveRestore size={16} />}
            {status === "PUBLISHED" ? "Archive" : "Unarchive"}
          </Button>
        </PopoverClose>
        {isAdmin && (
          <PopoverClose asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("edit_id", id.toString());
                router.push(`?${params.toString()}`);
              }}
            >
              <Edit size={16} />
              Edit
            </Button>
          </PopoverClose>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default StatusDropdown;
