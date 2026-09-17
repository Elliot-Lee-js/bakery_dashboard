import AdminNavbar from "@/components/AdminNavbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  return (
    <SidebarProvider style={{
      "--sidebar-width": "14rem",
      "--sidebar-width-mobile": "14rem",
    } as React.CSSProperties} defaultOpen={defaultOpen}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar - fixed width */}
        {/* <AppSidebar />    Develop Later */}
        
        {/* Main content - takes remaining space */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Navbar - fills the remaining width */}
            {/* <SidebarTrigger />    Develop Later*/}
          <div className="flex items-center gap-1 p-1 border-b bg-white">
            <div className="flex-1">
              <AdminNavbar />
            </div>
          </div>
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}