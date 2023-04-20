export default function Page() {
  return (
    <div className="col-span-12 grid w-full grid-cols-12">
      <main className="col-span-9">Main content</main>
      <aside className="col-span-3 m-2 hidden space-y-4 lg:block lg:basis-1/4"></aside>
    </div>
  );
}
