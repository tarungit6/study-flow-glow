
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./dashboard/OverviewTab";
import { CoursesTab } from "./dashboard/CoursesTab";
import { GamifyTab } from "./dashboard/GamifyTab";
import { CommunityTab } from "./dashboard/CommunityTab";
import { WelcomeHeader } from "./dashboard/WelcomeHeader";

const tabs = [
  { id: "overview", label: "Overview", emoji: "📊" },
  { id: "courses", label: "Courses", emoji: "📚" },
  { id: "gamify", label: "Gamify", emoji: "🎮" },
  { id: "community", label: "Community", emoji: "👥" }
] as const;

export function Dashboard() {
  return (
    <main className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <WelcomeHeader />

      <div className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 rounded-3xl border border-white/20 dark:border-slate-700/30 p-6 shadow-xl">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 p-1 rounded-2xl" aria-label="Dashboard sections">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="rounded-xl text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white"
              >
                <span className="mr-2">{tab.emoji}</span>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <CoursesTab />
          </TabsContent>
          
          <TabsContent value="gamify" className="space-y-6">
            <GamifyTab />
          </TabsContent>
          
          <TabsContent value="community" className="space-y-6">
            <CommunityTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
