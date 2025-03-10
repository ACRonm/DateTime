import { Clock, Calendar, Home, Settings, Globe } from "lucide-react"
import Link from "next/link";
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
 
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Converter",
    url: "/converter",
    icon: Clock,
  },
    //   {
    //     title: "Timezone Tool",
    //     url: "/timezone",
    //     icon: Globe,
    //   },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
  },
    //   {
    //     title: "Settings",
    //     url: "/settings",
    //     icon: Settings,
    //   },
]
 
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Timezone</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                          <Link href={item.url} prefetch={true}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                          </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
