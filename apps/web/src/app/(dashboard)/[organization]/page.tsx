import { SidebarTrigger } from "@/components/ui/sidebar";
import Search from "@/components/search";
import UserMenu from "@/components/user-menu";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export type pageProps = { params: Promise<{ organization: string }> };

export default async function Dashboard(props: pageProps) {
  const params = await props.params;
  const { organization } = params;

  await authClient.organization.setActive({
    organizationSlug: organization,
  });

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h1>Organization: {organization}</h1>
      </div>
    </>
  );
}
