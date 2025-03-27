import { AuthShowcase } from "@/components/auth/showcase";
import { Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Clock className="size-4" />
          </div>
          Loggrr
        </div>
        <AuthShowcase />
      </div>
    </div>
  );
}
