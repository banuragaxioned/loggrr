import { OrganizationList } from "./organization-list";

export default function Page() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Your Organizations</h1>
      <OrganizationList />
    </div>
  );
}
