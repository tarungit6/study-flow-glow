import {
  Calendar,
  Clock,
  Layers,
  ListTodo,
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  Settings,
  ShieldAlert,
  Users,
  BookOpen,
  FilePieChart,
  LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

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
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { useAssignments } from "@/hooks/api/useAssignments"; 
import { useEnrollments } from "@/hooks/api/useCourses";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | number | null; // Allow number for dynamic badges
}

export function AppSidebar() {
  const { profile, loading: authLoading } = useAuth();
  
  // Fetch data for badges - assuming these hooks fetch for the current user
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  // Assuming useAssignments returns assignments with a 'status' field
  const { data: assignmentsData, isLoading: assignmentsLoading } = useAssignments();

  const loading = authLoading || enrollmentsLoading || assignmentsLoading;

  if (loading) {
    return (
      <Sidebar className="border-r">
        <SidebarHeader>
          <div className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel><Skeleton className="h-4 w-24" /></SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[...Array(4)].map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <div className="flex items-center gap-2 p-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4">
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }

  const pendingAssignmentsCount = assignmentsData?.filter(a => a.status === 'Pending').length || 0;
  const activeCoursesCount = enrollments?.length || 0;

  let currentMenuItems: MenuItem[] = [];
  let sidebarHeaderText = "StudyFlow";
  let sidebarSubText = "Learn & Grow";
  let logoInitial = "S";
  let footerContent: React.ReactNode = null;

  const studentMenuItems: MenuItem[] = [
    { title: "Dashboard", url: "/", icon: Layers, badge: null },
    { title: "My Courses", url: "/courses", icon: Calendar, badge: activeCoursesCount > 0 ? activeCoursesCount : null },
    { title: "Assignments", url: "/assignments", icon: ListTodo, badge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : null },
    { title: "Schedule", url: "/schedule", icon: Clock, badge: null },
  ];

  const studentFooter = (
    <div className="p-4">
      <div className="rounded-lg gradient-card border p-4">
        <h3 className="font-medium text-sm mb-2">🎯 Daily Goal</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Study Time</span>
            {/* This part will be updated in DailyGoalTracker.tsx */}
            <span>Loading...</span> 
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="gradient-primary h-2 rounded-full" style={{width: "0%"}}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const instructorMenuItems: MenuItem[] = [
    { title: "Dashboard", url: "/instructor", icon: LayoutDashboard, badge: null },
    { title: "Upload Content", url: "/instructor/upload", icon: Upload, badge: null },
    { title: "Create Tests", url: "/instructor/tests", icon: FileText, badge: null },
    { title: "My Courses", url: "/courses", icon: Calendar, badge: null }, // Instructors might see courses they manage
    { title: "Analytics", url: "#", icon: BarChart3, badge: null },
    { title: "Settings", url: "#", icon: Settings, badge: null },
  ];

  const instructorFooter = (
     <div className="p-4 text-center text-sm text-muted-foreground">
        Instructor Portal
      </div>
  );

  const adminMenuItems: MenuItem[] = [
    { title: "Dashboard", url: "/admin", icon: ShieldAlert, badge: null },
    { title: "User Management", url: "#", icon: Users, badge: null },
    { title: "Course Management", url: "#", icon: BookOpen, badge: null },
    { title: "System Analytics", url: "#", icon: BarChart3, badge: null },
    { title: "Reports", url: "#", icon: FilePieChart, badge: null },
    { title: "Settings", url: "#", icon: Settings, badge: null },
  ];

   const adminFooter = (
    <div className="p-4 text-center text-sm text-muted-foreground">
      Admin Control Panel
    </div>
  );

  if (profile?.role === 'instructor') {
    currentMenuItems = instructorMenuItems;
    sidebarHeaderText = "Instructor Panel";
    sidebarSubText = "Empower Learning";
    logoInitial = "I";
    footerContent = instructorFooter;
  } else if (profile?.role === 'super_admin' || profile?.role === 'client_admin') {
    currentMenuItems = adminMenuItems;
    sidebarHeaderText = "Admin Panel";
    sidebarSubText = "Manage Platform";
    logoInitial = "A";
    footerContent = adminFooter;
  } else { // Default to student
    currentMenuItems = studentMenuItems;
    sidebarHeaderText = "StudyFlow";
    sidebarSubText = "Learn & Grow";
    logoInitial = "S";
    footerContent = studentFooter; // We'll update this footer's content via DailyGoalTracker later
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">{logoInitial}</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">{sidebarHeaderText}</h1>
              <p className="text-xs text-muted-foreground">{sidebarSubText}</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-accent transition-colors">
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        "flex items-center justify-between w-full" +
                        (isActive && item.url !== "#" ? " bg-accent font-semibold" : "")
                      }
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        {footerContent}
      </SidebarFooter>
    </Sidebar>
  );
}
