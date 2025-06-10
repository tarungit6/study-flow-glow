
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Star } from "lucide-react";

export function CoursesTab() {
  const courses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      progress: 75,
      nextTopic: "Calculus Integration",
      recentActivity: "Quiz completed 2h ago",
      difficulty: "Hard",
      instructor: "Dr. Smith",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Computer Science",
      progress: 60,
      nextTopic: "Data Structures",
      recentActivity: "Lesson watched yesterday",
      difficulty: "Medium",
      instructor: "Prof. Johnson",
      color: "bg-purple-500",
    },
    {
      id: 3,
      title: "Physics Fundamentals",
      progress: 85,
      nextTopic: "Quantum Mechanics",
      recentActivity: "Assignment submitted",
      difficulty: "Hard",
      instructor: "Dr. Williams",
      color: "bg-green-500",
    },
    {
      id: 4,
      title: "English Literature",
      progress: 45,
      nextTopic: "Shakespeare Analysis",
      recentActivity: "New lesson available",
      difficulty: "Easy",
      instructor: "Ms. Davis",
      color: "bg-pink-500",
    },
  ];

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "🟢";
      case "Medium": return "🟡";
      case "Hard": return "🔴";
      default: return "⚪";
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm text-muted-foreground">Active Courses</div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">66%</div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">12h</div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getDifficultyIcon(course.difficulty)}</span>
                  <Badge variant="outline">{course.progress}%</Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Course Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Next: {course.nextTopic}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{course.recentActivity}</span>
                  </div>
                </div>
                
                <Button className="w-full gradient-primary border-0 text-white hover:opacity-90">
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
