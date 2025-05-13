import { SessionsList } from "./sessions-client";

export default function Account() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Account</h1>
      <div className="flex flex-col gap-4">
        <SessionsList />
      </div>
    </div>
  );
}
