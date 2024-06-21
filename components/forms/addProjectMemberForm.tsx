"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "lucide-react";

import { ComboBox } from "../ui/combobox";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface Users {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
  status?: any;
  role?: any;
  userGroup?: any;
}

export function AddMemberInProject({ team, project, users }: { team: string; project: number; users: Users[] }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const SheetCloseButton = useRef<HTMLButtonElement>(null);

  const submitHandler = async () => {
    if (selectedUser.id) {
      try {
        const response = await fetch("/api/team/project/members", {
          method: "POST",
          body: JSON.stringify({
            team: team,
            projectId: +project,
            userData: selectedUser,
          }),
        });

        if (response.ok) {
          toast.success("User added successfully");
          setSelectedUser(null);
        }
        SheetCloseButton.current?.click();
        router.refresh();
      } catch (error) {
        console.error("Error adding new member", error);
      }
    }
  };

  const handleOpenChange = (evt: boolean) => {
    if (evt) {
      setSelectedUser(null);
    }
  };

  const dropdownSelectHandler = (selected: string) => {
    const selectedUser = users.find((user) => user.id === +selected);
    if (selectedUser && !selectedUser?.image) {
      selectedUser.image = "";
    }
    setSelectedUser(selectedUser || null);
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <div className="flex justify-between">
        <h2>Manage team</h2>
        <SheetTrigger asChild>
          <Button size="sm">Add a member</Button>
        </SheetTrigger>
      </div>
      <SheetContent side="right" className="h-full overflow-y-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitHandler();
          }}
          className="my-2 flex flex-col gap-2"
        >
          <SheetHeader>
            <SheetTitle>Add a member</SheetTitle>
            <SheetDescription>Add member to this project</SheetDescription>
          </SheetHeader>
          <div className="w-full-combo col-span-2 my-2">
            <label className="mb-1 block">Member</label>
            <ComboBox
              searchable
              icon={<User size={16} />}
              options={users}
              label="Members"
              selectedItem={selectedUser}
              handleSelect={(selected) => dropdownSelectHandler(selected)}
              className="w-full max-w-full"
            />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <SheetClose asChild>
              <Button type="button" variant="outline" ref={SheetCloseButton}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={!selectedUser}>
              Submit
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
