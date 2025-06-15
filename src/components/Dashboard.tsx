
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
    <main className="space-y-8 animate-fade-in w-full max-w-none">
      <WelcomeHeader />

      <div className="backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-white/30 dark:border-slate-700/30 p-8 shadow-2xl shadow-blue-500/5 dark:shadow-black/20">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-lg mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 p-1.5 rounded-2xl shadow-lg" aria-label="Dashboard sections">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="rounded-xl text-sm font-medium transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
              >
                <span className="mr-2 text-base">{tab.emoji}</span>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <OverviewTab />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-8">
            <CoursesTab />
          </TabsContent>
          
          <TabsContent value="gamify" className="space-y-8">
            <GamifyTab />
          </TabsContent>
          
          <TabsContent value="community" className="space-y-8">
            <CommunityTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
