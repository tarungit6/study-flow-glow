
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, Zap } from "lucide-react";

export function GamifyTab() {
  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first lesson", icon: "🎯", unlocked: true },
    { id: 2, title: "Quiz Master", description: "Score 90%+ on 5 quizzes", icon: "🧠", unlocked: true },
    { id: 3, title: "Streak Legend", description: "Maintain a 30-day streak", icon: "🔥", unlocked: false },
    { id: 4, title: "Night Owl", description: "Study after 10 PM for 7 days", icon: "🦉", unlocked: true },
    { id: 5, title: "Speed Runner", description: "Complete 10 lessons in one day", icon: "⚡", unlocked: false },
    { id: 6, title: "Perfectionist", description: "Get 100% on 3 consecutive quizzes", icon: "💎", unlocked: false },
  ];

  const challenges = [
    { title: "Master Calculus", description: "Complete 5 calculus lessons this week", progress: 60, xp: 250 },
    { title: "Quiz Champion", description: "Score 85%+ on 3 different subjects", progress: 33, xp: 150 },
    { title: "Daily Devotion", description: "Study for 7 consecutive days", progress: 85, xp: 300 },
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah M.", xp: 2450, avatar: "👩" },
    { rank: 2, name: "Mike R.", xp: 2380, avatar: "👨" },
    { rank: 3, name: "You (Alex)", xp: 2210, avatar: "👤" },
    { rank: 4, name: "Emma L.", xp: 2150, avatar: "👩" },
    { rank: 5, name: "David K.", xp: 2080, avatar: "👨" },
  ];

  return (
    <div className="space-y-6">
      {/* XP Progress */}
      <Card className="gradient-card border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">Level 12</h3>
              <p className="text-muted-foreground">2,210 XP</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level 13</span>
              <span>210/500 XP</span>
            </div>
            <Progress value={42} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="space-y-6">
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    achievement.unlocked ? 'bg-background/50' : 'bg-background/20 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && <Badge variant="secondary">Unlocked</Badge>}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Challenges */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Weekly Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{challenge.title}</h4>
                      <p className="text-xs text-muted-foreground">{challenge.description}</p>
                    </div>
                    <Badge variant="outline">+{challenge.xp} XP</Badge>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card className="gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Weekly Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.map((user) => (
              <div 
                key={user.rank} 
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  user.name.includes('You') ? 'bg-primary/10 border border-primary/20' : 'bg-background/50'
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-sm font-bold">
                  {user.rank}
                </div>
                <span className="text-xl">{user.avatar}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</p>
                </div>
                {user.rank <= 3 && (
                  <span className="text-lg">
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                  </span>
                )}
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View Full Leaderboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
