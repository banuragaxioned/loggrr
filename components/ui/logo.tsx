import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "mark";
  className?: string;
}

function LogMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Top bar — fuchsia, widest, same in both modes */}
      <rect x="20" y="33" width="80" height="14" rx="7" className="fill-brand-fuchsia" />
      {/* Middle bar — eggplant light / lilac dark */}
      <rect x="20" y="56" width="54" height="14" rx="7" className="fill-brand-eggplant dark:fill-brand-lilac" />
      {/* Bottom bar — faded */}
      <rect x="20" y="79" width="68" height="14" rx="7" className="fill-brand-eggplant dark:fill-brand-lilac opacity-40" />
    </svg>
  );
}

export function Logo({ variant = "full", className }: LogoProps) {
  if (variant === "mark") {
    return <LogMark className={cn("h-8 w-auto", className)} />;
  }

  return (
    <span
      className={cn("inline-flex items-center gap-3", className)}
      role="img"
      aria-label="loggrr."
    >
      <LogMark className="h-8 w-auto shrink-0" />
      <span
        className="text-brand-eggplant dark:text-brand-lilac"
        style={{
          fontFamily: "var(--font-heading), 'Cal Sans', system-ui, sans-serif",
          fontWeight: 600,
          fontSize: "1.75rem",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        loggrr<span className="text-brand-fuchsia">.</span>
      </span>
    </span>
  );
}
