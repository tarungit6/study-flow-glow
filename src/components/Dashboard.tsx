
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User } from "lucide-react";

export function Dashboard() {
  const courses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      progress: 75,
      nextLesson: "Calculus Integration",
      dueDate: "Tomorrow",
      instructor: "Dr. Smith",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Computer Science",
      progress: 60,
      nextLesson: "Data Structures",
      dueDate: "2 days",
      instructor: "Prof. Johnson",
      color: "bg-purple-500",
    },
    {
      id: 3,
      title: "Physics Fundamentals",
      progress: 85,
      nextLesson: "Quantum Mechanics",
      dueDate: "Next week",
      instructor: "Dr. Williams",
      color: "bg-green-500",
    },
    {
      id: 4,
      title: "English Literature",
      progress: 45,
      nextLesson: "Shakespeare Analysis",
      dueDate: "3 days",
      instructor: "Ms. Davis",
      color: "bg-pink-500",
    },
  ];

  const upcomingDeadlines = [
    { title: "Math Assignment #5", course: "Advanced Mathematics", dueDate: "Today", urgent: true },
    { title: "CS Project Submission", course: "Computer Science", dueDate: "Tomorrow", urgent: true },
    { title: "Physics Lab Report", course: "Physics Fundamentals", dueDate: "3 days", urgent: false },
    { title: "Literature Essay", course: "English Literature", dueDate: "1 week", urgent: false },
  ];

  const achievements = [
    { title: "🔥 7-Day Streak", description: "Completed lessons for 7 days straight!" },
    { title: "🎯 Quiz Master", description: "Scored 90%+ on 5 consecutive quizzes" },
    { title: "📚 Bookworm", description: "Read 10 assigned articles this month" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Alex! 🎓</h2>
            <p className="text-white/90">You have 3 assignments due this week. Let's crush those goals!</p>
          </div>
          <div className="hidden md:block animate-float">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card border-0 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Progress</p>
                <p className="text-2xl font-bold">66%</p>
              </div>
              <div className="w-12 h-12 gradient-success rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Streak</p>
                <p className="text-2xl font-bold">7 days</p>
              </div>
              <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🔥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assignments</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                <span className="text-white text-lg">📝</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="courses" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses" className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="gradient-card border-0 hover:shadow-lg transition-all hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${course.color}`}></div>
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{course.progress}%</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Next: {course.nextLesson}</p>
                          <p className="text-xs text-muted-foreground">Due in {course.dueDate}</p>
                        </div>
                        <Button size="sm" className="gradient-primary border-0 text-white hover:opacity-90">
                          Continue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="recommended" className="space-y-4">
              <Card className="gradient-card border-0">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 gradient-secondary rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="font-semibold mb-2">Strengthen Your Math Skills</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Based on your recent quiz results, we recommend focusing on integration techniques.
                    </p>
                    <Button className="gradient-primary border-0 text-white">
                      Start Practice Tests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">📅 Upcoming Deadlines</CardTitle>
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

          {/* Achievements */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">🏆 Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                  <h4 className="font-medium text-sm mb-1">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
