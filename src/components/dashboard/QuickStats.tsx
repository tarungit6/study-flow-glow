
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";

export function QuickStats() {
  const stats = [
    { icon: Calendar, label: "Courses", value: "4", color: "gradient-primary" },
    { icon: TrendingUp, label: "Avg Progress", value: "66%", color: "gradient-success" },
    { icon: Clock, label: "This Week", value: "12h", color: "gradient-secondary" },
    { icon: Target, label: "Goals Met", value: "3/4", color: "bg-warning" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="gradient-card border-0 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
