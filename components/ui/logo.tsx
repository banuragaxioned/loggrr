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
      {/* Top bar — fuchsia, widest */}
      <rect x="20" y="33" width="80" height="14" rx="7" fill="#F31C7E" />
      {/* Middle bar — eggplant light / lilac dark */}
      <rect x="20" y="56" width="54" height="14" rx="7" className="fill-[#1A0A40] dark:fill-[#EFEBF7]" />
      {/* Bottom bar — faded */}
      <rect x="20" y="79" width="68" height="14" rx="7" className="fill-[#1A0A40] dark:fill-[#EFEBF7]" opacity="0.4" />
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
        className="text-[#1A0A40] dark:text-[#EFEBF7]"
        style={{
          fontFamily: "var(--font-heading), 'Cal Sans', system-ui, sans-serif",
          fontWeight: 600,
          fontSize: "1.75rem",
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        loggrr<span style={{ color: "#F31C7E" }}>.</span>
      </span>
    </span>
  );
}
