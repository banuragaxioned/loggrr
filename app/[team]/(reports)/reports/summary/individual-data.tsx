"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TableCell, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import LoggedData from "./logged-data";

export default function IndividualData({ membersData }: { membersData: any }) {
  return (
    membersData &&
    membersData.map((member: any) => (
      <Collapsible key={member.id} asChild>
        <>
          <TableRow>
            <TableCell>
              <span className="ml-16 flex items-center gap-2">
                {member.loggedHours?.length > 0 && (
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="z-10 h-6 w-6 p-0">
                      <Plus size={16} />
                    </Button>
                  </CollapsibleTrigger>
                )}
                {member.name}
              </span>
            </TableCell>
            <TableCell className="opacity-50">{member.hours} h</TableCell>
          </TableRow>
          <CollapsibleContent asChild>
            <LoggedData loggedData={member.loggedHours} />
          </CollapsibleContent>
        </>
      </Collapsible>
    ))
  );
}
