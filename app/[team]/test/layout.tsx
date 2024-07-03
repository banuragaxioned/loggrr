import { AI } from "@/app/_actions/ai-action";

export default async function DashboardLayout({ children }: { children?: React.ReactNode }) {
  return <AI>{children}</AI>;
}
