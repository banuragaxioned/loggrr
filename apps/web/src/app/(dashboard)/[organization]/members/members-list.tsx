"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
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

interface Member {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

type Role = "member" | "admin" | "owner";

export function MembersList() {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("member");
  const [isOpen, setIsOpen] = useState(false);

  const members = useQuery({
    ...trpc.member.getAll.queryOptions(),
    placeholderData: [],
  });

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberEmail.trim() && selectedRole) {
      // TODO: Implement invite functionality
      setNewMemberEmail("");
      setSelectedRole("member");
      setIsOpen(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="size-4" />
            Invite Member
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <form onSubmit={handleInviteMember} className="space-y-4">
            <SheetHeader>
              <SheetTitle>Invite New Member (Dummy)</SheetTitle>
              <SheetDescription>Invite a new member to your organization.</SheetDescription>
            </SheetHeader>
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="member-email">Email</label>
                <Input
                  id="member-email"
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter member's email"
                />
              </div>

              <div>
                <label htmlFor="role">Role</label>
                <Select value={selectedRole} onValueChange={(value: Role) => setSelectedRole(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SheetFooter>
              <Button type="submit" className="w-full" disabled={!newMemberEmail.trim() || !selectedRole}>
                Send Invitation
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

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Members</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {members.isFetching
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))
              : members.data?.map((member: Member) => (
                  <div key={member.id} className="rounded-lg border p-4">
                    <h2>{member.user.name ?? "Unnamed User"}</h2>
                    <p className="text-sm text-muted-foreground">{member.user.email ?? "No email"}</p>
                    <p className="text-sm text-muted-foreground">Role: {member.role}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
