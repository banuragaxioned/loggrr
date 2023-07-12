import React,{useState} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";
import { DateRangePicker } from "@/components/datePicker";

const submitHandler = (e:any)=> {
  e.preventDefault();
  console.log(e)
}

export const TableInput = ({hours,type}:any)=> {

  const [range,setRange] = useState<any>(null);
  const [formData,setFormData] = useState<any>({billable:0});
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
            className="basis-14"
            type="number"
            onBlur={(e)=>console.log(e.target.value)}
            defaultValue={hours}
            />
              </div>
              </div>
              <div className="basis-[48%]">
              <label>Non-billable</label>
              <div className="basis-[90%] mx-auto flex">
              <Input 
            className="basis-14"
            type="number"
            onBlur={(e)=>console.log(e.target.value)}
            // defaultValue={hours}
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