
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";

export function DailyGoalTracker() {
  const goals = [
    { task: "Complete 2 lessons", completed: true, progress: 100 },
    { task: "Take 1 practice quiz", completed: true, progress: 100 },
    { task: "Study for 30 minutes", completed: false, progress: 70 },
    { task: "Review yesterday's notes", completed: false, progress: 0 },
  ];

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const overallProgress = (completedGoals / totalGoals) * 100;

  const motivationalMessages = [
    "You're crushing it today! 🚀",
    "Keep up the momentum! 💪",
    "Almost there, don't give up! ⭐",
    "You've got this! 🎯"
  ];

  const getMessage = () => {
    if (overallProgress === 100) return "Perfect day! All goals completed! 🎉";
    if (overallProgress >= 75) return motivationalMessages[0];
    if (overallProgress >= 50) return motivationalMessages[1];
    if (overallProgress >= 25) return motivationalMessages[2];
    return motivationalMessages[3];
  };

  return (
    <Card className="gradient-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Today's Goals</span>
          <span className="text-sm font-normal text-muted-foreground">
            {completedGoals}/{totalGoals} completed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Daily Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-sm text-center text-muted-foreground font-medium">
            {getMessage()}
          </p>
        </div>
        
        <div className="space-y-3">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center gap-3">
              {goal.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              <div className="flex-1">
                <span className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {goal.task}
                </span>
                {!goal.completed && goal.progress > 0 && (
                  <Progress value={goal.progress} className="h-1 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
