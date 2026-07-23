import { cn } from "@/lib/utils";

export function RequiredAsterisk({ className }: { className?: string }) {
  return (
    <span className={cn("text-destructive", className)} aria-hidden>
      *
    </span>
  );
}

export function RequiredFieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {label}
      {required && <RequiredAsterisk />}
    </span>
  );
}
