import { AddTime } from "@/components/add-time";

export default function Dashboard() {
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section className="lg:basis-4/6">
        <span className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-sm dark:border-slate-600">
          <p>Calendar comes here</p>
        </span>
        <AddTime />
        <span className="flex h-80 w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-sm dark:border-slate-600">
          <p>Logged time entries come here</p>
        </span>
      </section>
      <section className="hidden lg:block lg:basis-2/6">
        <span className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-slate-300 text-sm dark:border-slate-600">
          <p>Sidebar</p>
        </span>
      </section>
    </div>
  );
}
