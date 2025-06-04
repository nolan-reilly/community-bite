// FOOD-BANK DASHBOARD LAYOUT
// CHILDREN ARE THE PAGES THAT WILL BE RENDERED INSIDE THE LAYOUT (EX: /food-bank/inventory or /food-bank/donations etc.)
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { FoodBankSidebar } from "@/components/food-bank-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      {/* BUILD ELEMENTS THAT ARE ALWAYS VISIBLE IN DASHBOARD HERE */}
      {/* <Navbar root="/food-bank" /> */}
      <SidebarProvider>
        <SidebarTrigger />
        <FoodBankSidebar />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
