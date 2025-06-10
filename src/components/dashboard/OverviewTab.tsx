
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, Zap } from "lucide-react";
import { DailyGoalTracker } from "./DailyGoalTracker";
import { AIRecommendations } from "./AIRecommendations";
import { QuickStats } from "./QuickStats";

export function OverviewTab() {
  const recentActivities = [
    { action: "Completed", subject: "Calculus Integration", time: "2 hours ago", type: "lesson" },
    { action: "Quiz scored 92%", subject: "Data Structures", time: "Yesterday", type: "quiz" },
    { action: "Started", subject: "Quantum Mechanics", time: "2 days ago", type: "lesson" },
  ];

  const upcomingDeadlines = [
    { title: "Math Assignment #5", course: "Advanced Mathematics", dueDate: "Today", urgent: true },
    { title: "CS Project Submission", course: "Computer Science", dueDate: "Tomorrow", urgent: true },
    { title: "Physics Lab Report", course: "Physics Fundamentals", dueDate: "3 days", urgent: false },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <QuickStats />
        <DailyGoalTracker />
        <AIRecommendations />
        
        {/* Recent Activity */}
        <Card className="gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'lesson' ? 'bg-blue-500' : 
                    activity.type === 'quiz' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.subject}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        {/* Upcoming Deadlines */}
        <Card className="gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div>
                  <p className="font-medium text-sm">{deadline.title}</p>
                  <p className="text-xs text-muted-foreground">{deadline.course}</p>
                </div>
                <Badge variant={deadline.urgent ? "destructive" : "secondary"}>
                  {deadline.dueDate}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Study Streak */}
        <Card className="gradient-card border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="font-bold text-2xl mb-1">7 Days</h3>
              <p className="text-sm text-muted-foreground mb-3">Study Streak</p>
              <Button size="sm" className="gradient-primary border-0 text-white">
                Keep Going!
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="gradient-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Target className="w-4 h-4 mr-2" />
              Take Practice Test
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Zap className="w-4 h-4 mr-2" />
              Review Weak Topics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
