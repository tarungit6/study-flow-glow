
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
  ];

  const upcomingDeadlines = [
    { title: "Math Assignment #5", course: "Advanced Mathematics", dueDate: "Today", urgent: true },
    { title: "CS Project Submission", course: "Computer Science", dueDate: "Tomorrow", urgent: true },
    { title: "Physics Lab Report", course: "Physics Fundamentals", dueDate: "3 days", urgent: false },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="xl:col-span-2 space-y-8">
        <QuickStats />
        <DailyGoalTracker />
        <AIRecommendations />
        
        {/* Recent Activity */}
        <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <Clock className="w-5 h-5 text-white" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground bg-white/50 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                  {activity.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-8">
        {/* Upcoming Deadlines */}
        <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/30">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm">{deadline.title}</p>
                  <Badge 
                    variant={deadline.urgent ? "destructive" : "secondary"}
                    className="rounded-full"
                  >
                    {deadline.dueDate}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{deadline.course}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Study Streak */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-3xl">🔥</span>
              </div>
              <div>
                <h3 className="font-bold text-3xl mb-1 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">7 Days</h3>
                <p className="text-sm text-muted-foreground font-medium">Study Streak</p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-0 text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
                <Trophy className="w-4 h-4 mr-2" />
                Keep Going!
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start rounded-xl border-white/20 dark:border-slate-700/30 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200">
              <Target className="w-4 h-4 mr-3" />
              Take Practice Test
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl border-white/20 dark:border-slate-700/30 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200">
              <Zap className="w-4 h-4 mr-3" />
              Review Weak Topics
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl border-white/20 dark:border-slate-700/30 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200">
              <BookOpen className="w-4 h-4 mr-3" />
              Browse New Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
