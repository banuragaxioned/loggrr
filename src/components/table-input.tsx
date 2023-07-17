import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/datePicker";
import updateAssignedHours from "@/app/actions/update";
import { Button } from "@/components/ui/button";
import useToast from "@/hooks/useToast";

export const TableInput = ({ hours, data, type }: any) => {
  const billable = data.hoursObj?.billableTime || 0;
  const nonBillable = data.hoursObj?.nonBillableTime || 0;
  const totaTime = data.hoursObj?.totalTime || 0;
  const isOnGoing = data.hoursObj?.frequency === "ONGOING";
  const [range, setRange] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ total: totaTime, nonBillable: nonBillable, billable: billable });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const showToast = useToast();
  const submitHandler = (e: any) => {
    e.preventDefault();
    const updatedData = { ...formData, total: formData.nonBillable + formData.billable };
    if (range?.from) {
      updateAssignedHours(updatedData, range, data.projectId, data.userId);
      showToast("A allocation was updated", "success");
      setSubmitted(true);
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
  return (
    <Popover>
      <PopoverTrigger className="mx-auto flex h-full w-12 cursor-default items-center justify-center">
        <Input
          className="mx-0 basis-14 cursor-pointer border-transparent text-center hover:border-hover"
          disabled={true}
          onMouseOver={(e: any) => (e.target.disabled = false)}
          onMouseOut={(e: any) => (e.target.disabled = true)}
          defaultValue={hours}
          name={data.isBillable ? "billable" : "nonBillable"}
          onInput={inputHandler}
          // onFocus={()=>setSubmitted(false)}
          onBlur={(e) =>
            !submitted
              ? (e.target.value = type === "billable" ? billable : type === "nonBillable" ? nonBillable : totaTime)
              : null
          }
          onKeyUp={keypressHandler}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 text-slate-500">
        <form method="POST" onSubmit={submitHandler} action="#FIXME" className="flex flex-col justify-center">
          <div className="mb-2 flex justify-center gap-x-[2%]">
            <div className="basis-[48%]">
              <label>Billable</label>
              <div className="mx-auto flex basis-[90%]">
                <Input
                  className="basis-full"
                  type="number"
                  name="billable"
                  disabled={data.isBillable ? false : true}
                  onInput={inputHandler}
                  defaultValue={billable}
                />
              </div>
            </div>
            <div className="basis-[48%]">
              <label>Non-billable</label>
              <div className="mx-auto flex basis-[90%]">
                <Input
                  className="basis-full"
                  type="number"
                  name="nonBillable"
                  onInput={inputHandler}
                  defaultValue={nonBillable}
                />
              </div>
            </div>
          </div>
          <div>
            <DateRangePicker setRange={setRange} isOnGoing={isOnGoing} startDate={new Date(data.date)} />
            <span className={dateError ? "visible text-xs text-red-500" : "invisible"}>Please select date</span>
          </div>
          <Button type="submit" className="mx-auto mt-2 w-auto">
            Update
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
