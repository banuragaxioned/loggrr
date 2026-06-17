"use client";

import { format, startOfDay, startOfToday, subDays } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import useLocale from "@/hooks/useLocale";
import { DateRangePicker } from "@/components/custom/date-range-picker";

export function MatrixToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const selectedRange = searchParams.get("range");
  const [start, end] = selectedRange?.split(",") || [];
  const startFrom = (start && startOfDay(new Date(start))) || subDays(startOfToday(), 30);
  const endTo = (end && startOfDay(new Date(end))) || startOfToday();

  const updateRange = (range: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(pathname + "?" + params.toString());
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed p-2">
      <DateRangePicker
        onUpdate={(values) => {
          const from = format(values.range.from, "MM-dd-yyyy");
          const to = format(values.range.to ?? startOfToday(), "MM-dd-yyyy");
          updateRange(`${from},${to}`);
        }}
        initialDateFrom={startFrom}
        initialDateTo={endTo}
        locale={locale}
        key={selectedRange}
      />
    </div>
  );
}
