import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export const TableInput = ({ hours, data, type, setSubmitCount }: any) => {
  const billable = data.hoursObj?.billableTime || 0;
  const nonBillable = data.hoursObj?.nonBillableTime || 0;
  const totaTime = data.hoursObj?.totalTime || 0;
  const isOnGoing = data.hoursObj?.frequency === "ONGOING";
  const [range, setRange] = useState<any>({ from: new Date(), to: new Date() });
  const [formData, setFormData] = useState<any>({ total: totaTime, nonBillable: nonBillable, billable: billable });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [Ongoing, setOngoing] = useState<boolean>(isOnGoing);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const onSuccess = () => {
    setSubmitted(true);
    toast.success("A allocation was updated");
  };

  const onFailure = () => {
    setSubmitted(false);
    toast.error("A allocation was not updated");
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    const updatedData = { ...formData, total: formData.nonBillable + formData.billable };
    if (range?.from) {
      fetch("/api/team/allocation/update", {
        method: "POST",
        body: JSON.stringify({
          billable: updatedData.billable,
          nonBillable: updatedData.nonBillable,
          total: updatedData.total,
          onGoing: Ongoing,
          startDate: new Date(range.from),
          endDate: new Date(range.to),
          projectId: data.projectId,
          userId: data.userId,
          team: data.team,
        }),
      })
        .then((res) => res)
        .then((res) => {
          if (res.status === 200) {
            setSubmitCount((prev: number) => prev + 1);
            onSuccess();
            setCalendarOpen(false);
          } else {
            onFailure();
          }
        })
        .catch((e) => onFailure());
    } else {
      setDateError(true);
    }
  };

  useEffect(() => setDateError(false), [range?.from]);

  const inputHandler = (e: any) => {
    const element = e.target;
    const temp = { ...formData, [element.name]: Number(element.value === "" ? 0 : element.value) };
    setFormData(temp);
  };

  const keypressHandler = (e: any) => {
    const element = e.target;
    if (e.key === "Enter") {
      element.value === "" ? (element.value = 0) : null;
      submitHandler(e);
    }
  };

  const blurHandler = (e: any) => {
    const element = e.target;
    element.value === "" ? (element.value = 0) : null;
  };

  const handleCalendarOpen = () => {
    setCalendarOpen(true);
  };

  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
  };

  return (
    <Popover>
      <PopoverTrigger className="mx-auto flex  w-12 cursor-default items-center justify-center">
        <Input
          className="hover:border-hover mx-0 h-auto basis-14 cursor-pointer border-transparent p-0 text-center"
          disabled={true}
          onMouseOver={(e: any) => (e.target.disabled = false)}
          onMouseOut={(e: any) => (e.target.disabled = true)}
          defaultValue={hours}
          name={data.isBillable ? "billable" : "nonBillable"}
          onInput={inputHandler}
          onFocus={() => setSubmitted(false)}
          onBlur={(e) => {
            !submitted
              ? (e.target.value = type === "billable" ? billable : type === "nonBillable" ? nonBillable : totaTime)
              : null;
            blurHandler(e);
          }}
          onKeyUp={keypressHandler}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 text-slate-500">
        <form method="POST" onSubmit={submitHandler} action="#FIXME" className="flex flex-col justify-center">
          <div className="mb-2 flex justify-center gap-x-[2%]">
            <div className="basis-[48%]">
              <label>Billable</label>
              <div className="mx-auto mt-2 flex basis-[90%]">
                <Input
                  className="basis-full"
                  type="number"
                  name="billable"
                  disabled={data.isBillable ? false : true}
                  onInput={inputHandler}
                  defaultValue={billable}
                  onBlur={blurHandler}
                />
              </div>
            </div>
            <div className="basis-[48%]">
              <label>Non-billable</label>
              <div className="mx-auto mt-2 flex basis-[90%]">
                <Input
                  className="basis-full"
                  type="number"
                  name="nonBillable"
                  onInput={inputHandler}
                  defaultValue={nonBillable}
                  onBlur={blurHandler}
                />
              </div>
            </div>
          </div>
          <div>
            <Popover>
              <PopoverTrigger>
                <Button onClick={handleCalendarOpen} className="mt-[10px] w-full">
                  {range
                    ? `${range.from.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${range.to.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : "Select Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                {calendarOpen && (
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={range?.from}
                    today={range?.to}
                    selected={range}
                    onSelect={handleDateSelect}
                    numberOfMonths={1}
                  />
                )}
              </PopoverContent>
            </Popover>
            <span className={dateError ? "visible text-xs text-red-500" : "invisible"}>Please select date</span>
          </div>
          <Button type="submit" className="mx-auto w-auto">
            Update
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
