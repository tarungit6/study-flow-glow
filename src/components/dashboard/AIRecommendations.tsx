
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, RotateCcw } from "lucide-react";

export function AIRecommendations() {
  const recommendations = [
    {
      type: "Review",
      title: "Revisit Integration Techniques",
      description: "You scored 65% on your last calculus quiz. Let's strengthen this topic!",
      subject: "Mathematics",
      priority: "High",
      estimatedTime: "20 min",
      icon: RotateCcw,
    },
    {
      type: "Practice",
      title: "Data Structures Deep Dive",
      description: "Based on your learning pattern, now's a great time to practice arrays and linked lists.",
      subject: "Computer Science",
      priority: "Medium",
      estimatedTime: "30 min",
      icon: BookOpen,
    },
    {
      type: "Challenge",
      title: "Quantum Physics Quiz",
      description: "You're ready for advanced quantum mechanics concepts. Take this challenge!",
      subject: "Physics",
      priority: "Low",
      estimatedTime: "15 min",
      icon: Brain,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <Card className="gradient-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
            <div className="flex items-start gap-3">
              <div className="gradient-primary rounded-full p-2 flex-shrink-0">
                <rec.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                      {rec.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{rec.estimatedTime}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {rec.subject}
                  </Badge>
                  <Button size="sm" className="gradient-primary border-0 text-white">
                    Start {rec.type}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
