import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const PopOver = () => {
  return (
    <Popover>
      <PopoverTrigger><Button variant="primary">Open</Button></PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>

  )
}