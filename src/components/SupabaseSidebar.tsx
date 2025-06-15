
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Search, 
  Inbox, 
  Calendar, 
  Users, 
  Target, 
  Trophy, 
  Bell, 
  Settings,
  Upload,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAssignments } from "@/hooks/api/useAssignments";
import { useNotifications } from "@/hooks/api/useNotifications";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  exact?: boolean;
  showBadge?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    exact: true,
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
    showBadge: true,
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
] as const;

const bottomNavItems: NavItem[] = [
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    showBadge: true,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
] as const;

export function SupabaseSidebar() {
  const { profile } = useAuth();
  const location = useLocation();
  const { assignments, isLoading: assignmentsLoading } = useAssignments();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();

  const pendingAssignments = useMemo(() => {
    if (!assignments || assignmentsLoading) return 0;
    return assignments.filter(a => a.status === 'published').length;
  }, [assignments, assignmentsLoading]);

  const unreadNotifications = useMemo(() => {
    if (!notifications || notificationsLoading) return 0;
    return notifications.filter(n => !n.is_read).length;
  }, [notifications, notificationsLoading]);

  const getBadgeCount = (item: NavItem) => {
    if (item.title === "Assignments") return pendingAssignments;
    if (item.title === "Notifications") return unreadNotifications;
    return 0;
  };

  return (
    <div className="fixed left-0 top-0 h-full w-16 hover:w-64 transition-all duration-300 z-50 group">
      {/* Sidebar Background */}
      <div className="h-full bg-slate-900 dark:bg-slate-950 border-r border-slate-800 dark:border-slate-800 shadow-xl">
        {/* Logo Section */}
        <div className="flex items-center justify-center h-16 border-b border-slate-800 dark:border-slate-800">
          <div className="flex items-center gap-3 px-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              StudyFlow
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col h-full">
          {/* Main Navigation */}
          <div className="flex-1 py-4">
            <div className="space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = item.exact ? 
                  location.pathname === item.url : 
                  location.pathname.startsWith(item.url);
                const badgeCount = item.showBadge ? getBadgeCount(item) : 0;

                return (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={({ isActive: navIsActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group/item
                      ${isActive || navIsActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {item.title}
                    </span>
                    {badgeCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto h-5 px-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        {badgeCount}
                      </Badge>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    <div className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover/item:opacity-0 group-hover:group-hover/item:opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.title}
                      {badgeCount > 0 && ` (${badgeCount})`}
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-slate-800 dark:border-slate-800 py-4">
            <div className="space-y-1 px-2">
              {bottomNavItems.map((item) => {
                const isActive = location.pathname === item.url;
                const badgeCount = item.showBadge ? getBadgeCount(item) : 0;

                return (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={({ isActive: navIsActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group/item
                      ${isActive || navIsActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {item.title}
                    </span>
                    {badgeCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto h-5 px-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        {badgeCount}
                      </Badge>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    <div className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover/item:opacity-0 group-hover:group-hover/item:opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.title}
                      {badgeCount > 0 && ` (${badgeCount})`}
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {/* User Info */}
            <div className="mt-4 px-2">
              <div className="flex items-center gap-3 px-3 py-2.5 text-slate-400">
                <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex-shrink-0"></div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-xs text-white font-medium whitespace-nowrap">
                    {profile?.full_name || 'Student'}
                  </div>
                  <div className="text-xs text-slate-500 capitalize whitespace-nowrap">
                    {profile?.role || 'student'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
