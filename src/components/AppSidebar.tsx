
import {
  Calendar,
  Clock,
  Layers,
  ListTodo,
  User,
  Bell,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: Layers,
    badge: null,
  },
  {
    title: "My Courses",
    url: "#",
    icon: Calendar,
    badge: "4",
  },
  {
    title: "Assignments",
    url: "#",
    icon: ListTodo,
    badge: "2",
  },
  {
    title: "Schedule",
    url: "#",
    icon: Clock,
    badge: null,
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
    badge: "5",
  },
  {
    title: "Profile",
    url: "#",
    icon: User,
    badge: null,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">StudyFlow</h1>
              <p className="text-xs text-muted-foreground">Learn & Grow</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-accent transition-colors">
                    <a href={item.url} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <div className="rounded-lg gradient-card border p-4">
            <h3 className="font-medium text-sm mb-2">🎯 Daily Goal</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Study Time</span>
                <span>2h 45m / 3h</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="gradient-primary h-2 rounded-full" style={{width: "92%"}}></div>
              </div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
