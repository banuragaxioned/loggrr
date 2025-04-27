"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Project {
  id: number;
  name: string;
  clientId: number;
  createdAt: string;
  status: "draft" | "active" | "completed" | "cancelled";
  updatedAt: string;
  organizationId: string;
  description: string | null;
  archived: boolean;
}

export function ProjectsList() {
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const projects = useQuery({
    ...trpc.project.getAll.queryOptions(),
    placeholderData: [],
  });

  const clients = useQuery({
    ...trpc.client.getAll.queryOptions(),
    placeholderData: [],
  });

  const createMutation = useMutation(
    trpc.project.create.mutationOptions({
      onSuccess: () => {
        projects.refetch();
        setNewProjectName("");
        setSelectedClient("");
        setIsOpen(false);
      },
    }),
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim() && selectedClient) {
      createMutation.mutate({
        name: newProjectName,
        clientId: parseInt(selectedClient),
      });
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="size-4" />
            New Project
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <form onSubmit={handleCreateProject} className="space-y-4">
            <SheetHeader>
              <SheetTitle>Create New Project</SheetTitle>
              <SheetDescription>Create a new project to start tracking time.</SheetDescription>
            </SheetHeader>
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="client">Client</label>
                <Select value={selectedClient} onValueChange={setSelectedClient} disabled={createMutation.isPending}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.data?.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="project-name">Project Name</label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <SheetFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending || !newProjectName.trim() || !selectedClient}
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Project"}
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.isFetching
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
          : projects.data?.map((project: Project) => (
              <div key={project.id} className="rounded-lg border p-4">
                <h2>{project.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Client: {clients.data?.find((c) => c.id === project.clientId)?.name}
                </p>
              </div>
            ))}
      </div>
    </>
  );
}
