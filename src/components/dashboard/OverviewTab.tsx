
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, Zap, BookOpen, Trophy } from "lucide-react";
import { DailyGoalTracker } from "./DailyGoalTracker";
import { AIRecommendations } from "./AIRecommendations";
import { QuickStats } from "./QuickStats";

export function OverviewTab() {
  const recentActivities = [
    { action: "Completed", subject: "Calculus Integration", time: "2 hours ago", type: "lesson", icon: "✅" },
    { action: "Quiz scored 92%", subject: "Data Structures", time: "Yesterday", type: "quiz", icon: "🎯" },
    { action: "Started", subject: "Quantum Mechanics", time: "2 days ago", type: "lesson", icon: "🚀" },
    { action: "Reviewed", subject: "Linear Algebra", time: "3 days ago", type: "review", icon: "📖" },
  ];

  const upcomingDeadlines = [
    { title: "Math Assignment #5", course: "Advanced Mathematics", dueDate: "Today", urgent: true },
    { title: "CS Project Submission", course: "Computer Science", dueDate: "Tomorrow", urgent: true },
    { title: "Physics Lab Report", course: "Physics Fundamentals", dueDate: "3 days", urgent: false },
    { title: "Chemistry Quiz", course: "Organic Chemistry", dueDate: "1 week", urgent: false },
  ];

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-4 gap-8">
      {/* Main Content - Takes more space on large screens */}
      <div className="2xl:col-span-3 space-y-8">
        <QuickStats />
        
        {/* Two column layout for medium content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <DailyGoalTracker />
          <AIRecommendations />
        </div>
        
        {/* Recent Activity - Full width */}
        <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:shadow-lg">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.subject}</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-white/60 dark:bg-slate-700/60 px-3 py-1 rounded-full whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Compact but informative */}
      <div className="2xl:col-span-1 space-y-8">
        {/* Upcoming Deadlines */}
        <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm line-clamp-2">{deadline.title}</p>
                  <Badge 
                    variant={deadline.urgent ? "destructive" : "secondary"}
                    className="rounded-full shrink-0 ml-2"
                  >
                    {deadline.dueDate}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{deadline.course}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Study Streak */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-400/30 to-orange-500/30 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-3xl">🔥</span>
              </div>
              <div>
                <h3 className="font-bold text-3xl mb-1 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">7 Days</h3>
                <p className="text-sm text-muted-foreground font-medium">Study Streak</p>
              </div>
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-0 text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
                <Trophy className="w-4 h-4 mr-2" />
                Keep Going!
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start rounded-xl border-white/30 dark:border-slate-700/30 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200">
              <Target className="w-4 h-4 mr-3" />
              Practice Test
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl border-white/30 dark:border-slate-700/30 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200">
              <Zap className="w-4 h-4 mr-3" />
              Review Topics
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl border-white/30 dark:border-slate-700/30 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200">
              <BookOpen className="w-4 h-4 mr-3" />
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
