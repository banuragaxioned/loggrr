import { getClients } from "@/server/services/project";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Tenant } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default async function Page({ params }: { params: { team: Tenant["slug"] } }) {
  const { team } = params;
  const clientList = await getClients(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Clients" text="This is a list of all clients">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Add</Button>
          </SheetTrigger>
          <SheetContent position="right" size="sm">
            <SheetHeader>
              <SheetTitle>New client</SheetTitle>
              <SheetDescription>
                Enter the name of the new client. This has to be unique. Make it easier for your team to fine and
                recognize.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Create</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </DashboardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientList.map((client) => (
            <TableRow key={client.id}>
              <TableCell key={client.id}>{client.name}</TableCell>
              <TableCell key={client.id}>{client.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardShell>
  );
}
