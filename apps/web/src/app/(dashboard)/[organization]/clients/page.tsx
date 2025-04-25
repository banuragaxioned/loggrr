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
import { DashboardHeader, DashboardShell } from "@/components/shell";

export default function Clients() {
  const [newClientName, setNewClientName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const clients = useQuery(trpc.client.getAll.queryOptions());
  const createMutation = useMutation(
    trpc.client.create.mutationOptions({
      onSuccess: () => {
        clients.refetch();
        setNewClientName("");
        setIsOpen(false);
      },
    }),
  );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClientName.trim()) {
      createMutation.mutate({ name: newClientName });
    }
  };

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Clients" text="You can find the list of clients here">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="size-4" />
                New Client
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <form onSubmit={handleCreateClient} className="space-y-4">
                <SheetHeader>
                  <SheetTitle>Create New Client</SheetTitle>
                  <SheetDescription>Create a new client to start tracking their time.</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <label htmlFor="client-name">Client Name</label>
                  <Input
                    id="client-name"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Enter client name"
                    disabled={createMutation.isPending}
                  />
                </div>

                <SheetFooter>
                  <Button type="submit" className="w-full" disabled={createMutation.isPending || !newClientName.trim()}>
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Client"}
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
        </DashboardHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.data?.map((client) => (
            <div key={client.id} className="rounded-lg border p-4">
              <h2>{client.name}</h2>
              <p className="text-sm text-muted-foreground">{client.createdAt}</p>
            </div>
          ))}
        </div>
      </DashboardShell>
    </>
  );
}
