
import { ThemeToggle } from "./ThemeToggle";
import { Bell, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SupabaseSidebar } from "./SupabaseSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    if (profile) {
      if (
        profile.role === "instructor" &&
        (location.pathname === "/" || location.pathname === "/index")
      ) {
        navigate("/instructor", { replace: true });
      }
      else if (profile.role !== "instructor" && location.pathname === "/instructor") {
        navigate("/", { replace: true });
      }
    }
  }, [profile, navigate, location.pathname]);

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 overflow-x-hidden">
      <SupabaseSidebar />
      <main className="flex-1 flex flex-col min-w-0 ml-16 transition-all duration-300">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="flex h-16 items-center justify-between px-8 max-w-none">
            <div className="flex items-center gap-4">
              <div className="block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  StudyFlow
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-pink-500 to-rose-500 border-0 text-white">
                  3
                </Badge>
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-700">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'Student'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {profile?.role || 'student'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main Content with optimized spacing */}
        <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}
