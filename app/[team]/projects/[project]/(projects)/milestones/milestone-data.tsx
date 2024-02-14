'use client';

import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDateRangePicker } from "@/components/date-picker";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


const formSchema = z.object({
  name: z.string().min(3).max(25, "Milestone name should be between 3 and 25 characters"),
  budget: z.string().regex(new RegExp(/^[1-9][0-9]*$/), "Please provide a budget"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  id: z.number()
});

const MilestoneData = ({ milestoneList, team, project }: { milestoneList: any[], team: string, project: number }) => {

  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const [isOngoing, setOngoing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/team/project/milestones", {
        method: "PUT",
        body: JSON.stringify({
          id: values.id,
          name: values.name,
          team,
          budget: Number(values.budget),
          startDate: values.startDate,
          endDate: values.endDate,
        }),
      });

      if (response.ok) {
        toast.success("Milestone updated successfully");
      } else {
        toast.error("Failed to update milestone");
      }
    } catch (error) {
      console.error("Error in updating milestone", error);
    }
  }

  const handleOpenChange = (e: boolean) => e && form.reset();

  const deleteMilestone = async (id: number) => {
    try {
      const response = await fetch("/api/team/project/milestones", {
        method: "DELETE",
        body: JSON.stringify({
          id,
          team,
          projectId: +project,
        }),
      });

      if (response.ok) {
        toast.success("Milestone deleted successfully");
      } else {
        toast.error("Failed to delete milestone");
      }
    } catch (error) {
      console.error("Error in deleting milestone", error);
    }
  }

  return (
    <div className="mt-7">
      {milestoneList.length ? <span className="inline-block capitalize text-gray-500 mb-2">{team}</span> : null}
      {Array.isArray(milestoneList) && milestoneList.length ? milestoneList.map((item, index) => {
        return (
          <div key={index} className="border p-3 rounded-md mb-5 flex justify-between group">
            <div>
              <h4 className="capitalize">{`Milestone name : ${item.name}`}</h4>
              <p>{`Month cycle: ${item?.startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${item?.endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}</p>
              <p>{`Budget : ${item.budget}`}</p>
            </div>
            <div className="flex gap-4 group-hover:visible invisible">
              <Sheet onOpenChange={handleOpenChange}>
                <SheetTrigger asChild>
                  <button title="Edit">
                    <Edit height={22} width={22} />
                  </button>
                </SheetTrigger>
                <SheetContent side="right">
                  <Form {...form}>
                    <SheetHeader>
                      <SheetTitle>Add a new Milestone</SheetTitle>
                      <SheetDescription>Make it unique and identifiale for your team.</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex flex-col gap-y-1">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => {
                          return (
                            <FormItem className="col-span-2 mt-2">
                              <FormLabel>Milestone name</FormLabel>
                              <FormControl className="mt-2">
                                <Input placeholder="Milestone Name" {...field} defaultValue={item.name} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="col-span-2 mt-2">
                            <FormLabel>Date Duration</FormLabel>
                            <FormControl className="mt-2">
                              <CalendarDateRangePicker setVal={form.setValue} setOngoing={setOngoing} isOngoing={isOngoing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem className="col-span-2 mt-2">
                            <FormLabel>Budget</FormLabel>
                            <FormControl className="mt-2">
                              <Input placeholder="Budget" {...field} type="number" defaultValue={item.budget} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <SheetFooter className="gap-x-4 mt-2">
                        <Button type="submit">Submit</Button>
                        <SheetClose asChild>
                          <Button type="submit" variant="outline" ref={SheetCloseButton}>
                            Cancel
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </form>
                  </Form>
                </SheetContent>
              </Sheet>

              <Dialog>
                <DialogTrigger asChild>
                  <button title="Delete">
                    <Trash height={22} width={22} color="red" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Are you sure to delete this milestone?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your milestone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <DialogClose>Cancel</DialogClose>
                    </Button>
                    <Button type="button" size="sm" onClick={() => deleteMilestone(item.id)} asChild>
                      <DialogClose>Delete</DialogClose>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )
      }) : <p className="text-gray-500">No Milestones Found</p>}
    </div>
  )
}

export default MilestoneData;
