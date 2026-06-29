import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TooltipProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  sideOffset?: number;
  contentClassName?: string;
}

export function CustomTooltip({ trigger, content, sideOffset, contentClassName }: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent className={cn("max-w-[300px]", contentClassName)} sideOffset={sideOffset}>
          {typeof content === "string" ? <p>{content}</p> : content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
