import React,{ useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";
import { DateRangePicker } from "@/components/datePicker";
import updateAssignedHours from "@/app/actions/update";


export const TableInput = ({hours,data,type,updateHandler}:any)=> {

  const billable = data.hoursObj?.billableTime || 0;
  const nonBillable = data.hoursObj?.nonBillableTime || 0;
  const totaTime = data.hoursObj?.totalTime || 0;
  const [range,setRange] = useState<any>(null);
  const [formData,setFormData] = useState<any>({total:totaTime,nonBillable:nonBillable,billable:billable});

  const submitHandler = (e:any)=> {
    e.preventDefault();
    const updatedData = {...formData,total:formData.nonBillable + formData.billable};
    updateAssignedHours(updatedData,range,data.projectId,data.userId);
  }

  const blurHandler = (e:any)=> {
    const element = e.target;
    setFormData((prev:any)=>({...prev,[element.name]:Number(element.value)}));
  }

    return (
        <Popover>
        <PopoverTrigger className="flex h-full justify-center items-center cursor-default w-12 mx-auto">
        <Input 
            className="basis-14 mx-0 border-transparent hover:border-hover cursor-pointer text-center"
            disabled={true}
            onMouseOver={(e:any)=>e.target.disabled = false}
            onMouseOut={(e:any)=>e.target.disabled = true}
            defaultValue={hours}
            />
        </PopoverTrigger>
        <PopoverContent className="w-64 text-slate-500">
            <form method="POST" onSubmit={submitHandler} action="#FIXME">
            <div className="flex mb-2 gap-x-[2%] justify-center">
              <div className="basis-[48%]">
                <label>Billable</label>
               <div className="basis-[90%] mx-auto flex">
               <Input 
            className="basis-16"
            type="number"
            name="billable"
            onBlur={blurHandler}
            defaultValue={billable}
            />
              </div>
              </div>
              <div className="basis-[48%]">
              <label>Non-billable</label>
              <div className="basis-[90%] mx-auto flex">
              <Input 
            className="basis-16"
            type="number"
            name="nonBillable"
            onBlur={blurHandler}
            defaultValue={nonBillable}
            />
              </div>
              </div>
            </div>
            <DateRangePicker setRange={setRange} />
           <Input type="submit" value="Update" className="mt-2 w-auto mx-auto text-slate-500 cursor-pointer"/>
            </form>
        </PopoverContent>
      </Popover>
    )
}