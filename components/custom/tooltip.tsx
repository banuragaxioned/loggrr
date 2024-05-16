import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TooltipTrigger {
  trigger: React.ReactNode;
  content: string;
  sideOffset?: number;
}

export function CustomTooltip({ trigger, content, sideOffset }: TooltipTrigger) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent className="max-w-[300px]" sideOffset={sideOffset}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
