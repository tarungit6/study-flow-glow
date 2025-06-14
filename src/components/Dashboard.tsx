import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./dashboard/OverviewTab";
import { CoursesTab } from "./dashboard/CoursesTab";
import { GamifyTab } from "./dashboard/GamifyTab";
import { CommunityTab } from "./dashboard/CommunityTab";
import { WelcomeHeader } from "./dashboard/WelcomeHeader";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "Courses" },
  { id: "gamify", label: "Gamify" },
  { id: "community", label: "Community" }
] as const;

export function Dashboard() {
  return (
    <main className="space-y-6 animate-fade-in">
      <WelcomeHeader />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-md" aria-label="Dashboard sections">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
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
    </main>
  );
}
