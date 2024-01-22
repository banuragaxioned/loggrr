"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import IndividualData from "./individual-data";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

import SUMMARY_DATA from "./dummy-data.json";

export default function ProjectsTable() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium">Name</TableHead>
            <TableHead className="font-medium">Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SUMMARY_DATA &&
            SUMMARY_DATA.map((project: any) => (
              <React.Fragment key={project.name}>
                <TableRow>
                  <TableCell className="font-semibold">
                    <span className="flex items-center gap-2">
                      {/* TODO: To be replaced with project Logo */}
                      <span className="flex h-6 w-6 rounded-full bg-slate-400" />
                      {project.name}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold">{project.hours} h</TableCell>
                </TableRow>
                {project.tasks.map((task: any) => (
                  <Collapsible key={task.id} asChild>
                    <>
                      <TableRow>
                        <TableCell>
                          <span className="ml-8 flex items-center gap-2">
                            {task.members?.length > 0 && (
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" className="h-6 w-6 p-0">
                                  <Plus size={16} />
                                </Button>
                              </CollapsibleTrigger>
                            )}
                            {task.name}
                          </span>
                        </TableCell>
                        <TableCell>{task.hours} h</TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <IndividualData membersData={task.members} />
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))}
              </React.Fragment>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
