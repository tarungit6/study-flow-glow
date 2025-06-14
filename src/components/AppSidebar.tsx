
import * as React from "react";
import { Calendar, Home, Inbox, Search, Settings, BookOpen, Users, Target, Trophy, Bell } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAssignments } from "@/hooks/api/useAssignments";
import { useNotifications } from "@/hooks/api/useNotifications";

const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john-doe.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Courses",
      url: "/courses",
      icon: BookOpen,
    },
    {
      title: "Browse Courses",
      url: "/browse-courses",
      icon: Search,
    },
    {
      title: "Assignments",
      url: "/assignments",
      icon: Inbox,
    },
    {
      title: "Schedule",
      url: "/schedule", 
      icon: Calendar,
    },
    {
      title: "Community",
      url: "/community",
      icon: Users,
    },
    {
      title: "Goals",
      url: "/goals",
      icon: Target,
    },
    {
      title: "Achievements",
      url: "/achievements",
      icon: Trophy,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile, signOut } = useAuth();
  const { assignments, isLoading: assignmentsLoading } = useAssignments();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();

  // Calculate pending assignments count
  const pendingAssignments = React.useMemo(() => {
    if (!assignments || assignmentsLoading) return 0;
    return assignments.filter(a => a.status === 'published').length;
  }, [assignments, assignmentsLoading]);

  // Calculate unread notifications count
  const unreadNotifications = React.useMemo(() => {
    if (!notifications || notificationsLoading) return 0;
    return notifications.filter(n => !n.is_read).length;
  }, [notifications, notificationsLoading]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Learning Platform</span>
                  <span className="truncate text-xs">Student Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.title === "Assignments" && pendingAssignments > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                          {pendingAssignments}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/notifications" className="flex items-center gap-2">
                    <Bell className="size-4" />
                    <span>Notifications</span>
                    {unreadNotifications > 0 && (
                      <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/settings" className="flex items-center gap-2">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-2 p-2">
              <div className="text-xs text-muted-foreground">
                Signed in as: {profile?.full_name || 'Student'}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="w-full"
              >
                Sign out
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
