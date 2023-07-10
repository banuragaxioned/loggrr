import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";

export const TableInput = ({hours}:any)=> {

    return (
        <Popover>
        <PopoverTrigger className="flex h-full justify-center items-center cursor-default w-14 mx-auto">
        <Input 
            className="basis-14 mx-0 border-transparent hover:border-hover cursor-pointer"
            disabled={true}
            onMouseOver={(e:any)=>e.target.disabled = false}
            onMouseOut={(e:any)=>e.target.disabled = true}
            value={hours}
            />
        </PopoverTrigger>
        <PopoverContent className="w-64 gap-[2%]">
            <div className="flex">
              <div className="basis-[48%]">
                <label>Billable</label>
               <div className="basis-[90%] mx-auto flex">
               <Input 
            className="basis-14 mx-auto"
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
            className="basis-14 mx-auto"
            type="number"
            onBlur={(e)=>console.log(e.target.value)}
            defaultValue={hours}
            />
              </div>
              </div>
            </div>
        </PopoverContent>
      </Popover>
    )
}