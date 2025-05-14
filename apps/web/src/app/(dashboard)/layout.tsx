import { AppSidebar } from "@/components/app-sidebar";
import Search from "@/components/search";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UserMenu from "@/components/user-menu";

export const description = "A sidebar with a header and a search form.";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <header className="flex h-14 shrink-0 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Search className="flex-1 max-w-md" />
            </div>
            <div className="ml-auto px-3">
              <UserMenu />
            </div>
          </header>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
