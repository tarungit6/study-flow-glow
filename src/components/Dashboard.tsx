
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./dashboard/OverviewTab";
import { CoursesTab } from "./dashboard/CoursesTab";
import { GamifyTab } from "./dashboard/GamifyTab";
import { CommunityTab } from "./dashboard/CommunityTab";
import { WelcomeHeader } from "./dashboard/WelcomeHeader";

export function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <WelcomeHeader />

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
