import Home from "@/components/home";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Launchpad",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  return (
    <Home user={user}/>
  );
}
