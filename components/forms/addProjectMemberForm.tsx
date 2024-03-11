"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "lucide-react";

import { ComboBox } from "../ui/combobox";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
    setSelectedUser(selectedUser || null);
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>Add</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitHandler();
          }}
          className="my-2 grid grid-cols-2 gap-2"
        >
          <SheetHeader>
            <SheetTitle>Add a new User</SheetTitle>
          </SheetHeader>
          <div className="col-span-2 my-2 w-full-combo">
            <label className="mb-1 block">User</label>
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
          <div className="mt-2 flex justify-between space-x-3">
            <Button type="submit" disabled={!selectedUser}>
              Submit
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" ref={SheetCloseButton}>
                Cancel
              </Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
