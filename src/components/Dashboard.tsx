
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./dashboard/OverviewTab";
import { CoursesTab } from "./dashboard/CoursesTab";
import { GamifyTab } from "./dashboard/GamifyTab";
import { CommunityTab } from "./dashboard/CommunityTab";

export function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Alex! 🎓</h2>
            <p className="text-white/90">Ready to continue your learning journey? You're doing great!</p>
          </div>
          <div className="hidden md:block animate-float">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="gamify">Gamify</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>
        
        <TabsContent value="gamify">
          <GamifyTab />
        </TabsContent>
        
        <TabsContent value="community">
          <CommunityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
