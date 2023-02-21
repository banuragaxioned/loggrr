import { AddTime } from "@/components/add-time";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSession, getSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section className="lg:basis-3/4">
        <span className="w-full flex-col items-center justify-center rounded-md border border-slate-300 text-sm dark:border-slate-600">
          <div className="flex">
            <CalendarDays className="h-3 w-3 border-spacing-[6px] border border-slate-300" />
            <div className="inline-flex gap-2">
              <ChevronLeft className="h-3 w-3" />
              <p>10 Mon Jan</p>
              <p>11 Tue Jan</p>
              <p>12 Wed Jan</p>
              <p>13 Thu Jan</p>
              <p>14 Fri Jan</p>
              <p>15 Sat Jan</p>
              <p>16 Sun Jan</p>
              <p>17 Mon Jan</p>
              <ChevronRight className=" h-3 w-3" />
            </div>
          </div>
          <div className="flex border-spacing-y-8 justify-between border-t border-slate-300">
            <p>Time logged for the day</p>
            <p>3.5 h</p>
          </div>
        </span>
        <AddTime />
        <span className="flex h-80 w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-sm dark:border-slate-600">
          <p>Logged time entries come here</p>
        </span>
      </section>
      <section className="hidden lg:block lg:basis-1/4">
        <span className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-sm dark:border-slate-600">
          <p>Sidebar</p>
        </span>
      </section>
    </div>
  );
}
