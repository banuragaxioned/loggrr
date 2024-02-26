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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AddMemberInProject({
  team,
  project,
  users,
}: {
  team: string;
  project: number;
  users: {
    id: number;
    name: string;
    email: string;
    image: string;
  }[];
}) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<any>(null);
  const SheetCloseButton = useRef<HTMLButtonElement>(null);

  async function onSubmit() {

    if (selectedUserId?.id) {
      const response = await fetch("/api/team/project/members", {
        method: "POST",
        body: JSON.stringify({
          team: team,
          projectId: +project,
          userId: selectedUserId?.id,
        }),
      });

      if (response.ok) {
        toast.success("User added");
      } else if (response.status === 500) {
        toast.warning("The user doesn't have an account");
      } else {
        toast.error("Something went wrong");
      }

      SheetCloseButton.current?.click();
      router.refresh();
    }
  }

  const handleOpenChange = (evt: boolean) => {
    if (evt) {
      setSelectedUserId(null);
    }
  };

  const dropdownSelectHandler = (selected: string) => {
    const selectedUser = users.find((user) => user.id === +selected);
    setSelectedUserId(selectedUser || null);
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
            onSubmit();
          }}
          className="my-2 grid grid-cols-2 gap-2"
        >
          <SheetHeader>
            <SheetTitle>Add a new User</SheetTitle>
          </SheetHeader>
          <div className="col-span-2 my-2">
            <label>User</label>
            <ComboBox
              tabIndex={1}
              searchable
              icon={<User size={16} />}
              options={users}
              label="Members"
              selectedItem={selectedUserId}
              handleSelect={(selected) => dropdownSelectHandler(selected)}
            />
          </div>
          <div className="mt-2 flex justify-between space-x-3">
            <Button type="submit" disabled={!selectedUserId}>
              Submit
            </Button>
            <SheetClose asChild>
              <Button type="submit" variant="outline" ref={SheetCloseButton}>
                Cancel
              </Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
