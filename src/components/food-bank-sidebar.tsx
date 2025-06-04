"use client"
import { Send, ShoppingCart, Gift, LogOut, UserCog, Package } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";


// Menu items.
const FoodBankMenu = [
  {
    title: "Inventory",
    url: "/food-bank/inventory",
    icon: Package,
  },
  {
    title: "Marketplace",
    url: "/food-bank/donation/feed",
    icon: ShoppingCart,
  },
  {
    title: "My Requests",
    url: "/food-bank/donation/request",
    icon: Send,
  },
  {
    title: "Donations Recieved",
    url: "/food-bank/donation/history",
    icon: Gift,
  },
  {
    title: "Profile",
    url: "#",
    icon: UserCog,
  },
  {
    title: "Logout",
    url: "/",
    icon: LogOut,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); 
      sessionStorage.clear();
      window.location.href = "/"; 
    },
  },

]

export function FoodBankSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarTrigger className="mb-5" />
            <>Close sidebar</>
            <SidebarMenu className="gap-5">
              {FoodBankMenu.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem
                    key={item.title}
                    className="transform transition-transform duration-200 hover:scale-110"
                  >
                    <SidebarMenuButton 
                      asChild
                      onClick={item.onClick ? (e) => item.onClick(e) : undefined}
                    >
                      <a
                        href={item.url}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md w-full ${
                          isActive ? "bg-gray-200 text-black text-lg font-bold" : ""
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </a>

                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}