import Navbar from "@/components/Navbar";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { DonorSidebar } from "@/components/donor-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* <Navbar root="/donor" /> */}
      <SidebarProvider>
        <SidebarTrigger />
        <DonorSidebar />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
