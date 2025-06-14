
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Target, Terminal } from "lucide-react";
import { useTodayGoal as useDailyGoals } from "@/hooks/api/useGoals"; // Using useTodayGoal and aliasing for current usage

export function DailyGoalTracker() {
  // Assuming useDailyGoals (now useTodayGoal) fetches an object like:
  // { id, goal_date, target_minutes, completed_minutes, is_achieved } for today
  // or null/undefined if no goal is set for today.
  const { data: dailyGoal, isLoading, error } = useDailyGoals();

  const motivationalMessages = [
    "You're crushing it today! 🚀",
    "Keep up the momentum! 💪",
    "Almost there, don't give up! ⭐",
    "You've got this! 🎯",
    "Set a goal to get started! ✨"
  ];

  if (isLoading) {
    return (
      <Card className="gradient-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <div className="space-y-3 pt-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="gradient-card border-0">
        <CardHeader>
          <CardTitle>Today's Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load daily goals: {error.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  let overallProgress = 0;
  let completedMessage = "No goal set for today.";
  let goalStatusText = "0/1 goal";

  // Ensure dailyGoal and its properties are valid before calculations
  const targetMinutes = dailyGoal?.target_minutes ?? 0;
  const completedMinutes = dailyGoal?.completed_minutes ?? 0;
  const isAchieved = dailyGoal?.is_achieved ?? false;

  if (dailyGoal && targetMinutes > 0) {
    overallProgress = Math.min((completedMinutes / targetMinutes) * 100, 100);
    goalStatusText = isAchieved ? "1/1 completed" : "0/1 completed";
  } else if (dailyGoal && targetMinutes === 0 && isAchieved) {
    // Handles cases where target might be 0 but goal is marked achieved (e.g. rest day goal)
    overallProgress = 100;
    goalStatusText = "1/1 completed";
  }


  const getMessage = () => {
    if (!dailyGoal || targetMinutes === 0) return motivationalMessages[4]; // "Set a goal..."
    if (overallProgress === 100) return "Perfect day! Goal completed! 🎉";
    if (overallProgress >= 75) return motivationalMessages[0];
    if (overallProgress >= 50) return motivationalMessages[1];
    if (overallProgress >= 25) return motivationalMessages[2];
    return motivationalMessages[3];
  };
  
  completedMessage = getMessage();

  // Simplified goals display based on dailyGoal structure
  const displayedGoals = [];
  if (dailyGoal && targetMinutes > 0) {
    displayedGoals.push({
      task: `Study for ${targetMinutes} minutes`,
      completed: isAchieved,
      progress: overallProgress,
    });
  } else if (dailyGoal && targetMinutes === 0 && isAchieved) {
     displayedGoals.push({
      task: `Daily goal achieved (e.g. Rest day)`,
      completed: true,
      progress: 100,
    });
  }
  // Add a placeholder if no goals or goal not loaded properly
   else if (!dailyGoal && !isLoading) { // Condition changed to !dailyGoal && !isLoading
    displayedGoals.push({
      task: "No specific goal set for today.",
      completed: false,
      progress: 0,
    });
  }


  return (
    <Card className="gradient-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Today's Goal</span>
          <span className="text-sm font-normal text-muted-foreground">
            {goalStatusText}
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
            {completedMessage}
          </p>
        </div>
        
        {displayedGoals.length > 0 && (
          <div className="space-y-3 border-t pt-4 mt-4">
            {displayedGoals.map((goal, index) => (
              <div key={index} className="flex items-center gap-3">
                {goal.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Target className="w-5 h-5 text-primary" /> 
                )}
                <div className="flex-1">
                  <span className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                    {goal.task}
                  </span>
                  {!goal.completed && goal.progress > 0 && dailyGoal && targetMinutes > 0 && (
                     <div className="text-xs text-muted-foreground mt-1">
                        {completedMinutes} / {targetMinutes} mins studied
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
         {!dailyGoal && !isLoading && displayedGoals.length === 0 && ( // Added displayedGoals.length === 0 to ensure message only shows if no goals are displayed
           <div className="text-center text-muted-foreground text-sm py-4">
             No daily goal set. Create one to track your progress!
             {/* TODO: Add a button/link to create/edit goals */}
           </div>
         )}
      </CardContent>
    </Card>
  );
}
