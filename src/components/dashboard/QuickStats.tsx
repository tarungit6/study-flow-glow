
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";

export function QuickStats() {
  const stats = [
    { 
      icon: Calendar, 
      label: "Active Courses", 
      value: "4", 
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      change: "+2 this month"
    },
    { 
      icon: TrendingUp, 
      label: "Avg Progress", 
      value: "66%", 
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30",
      change: "+12% this week"
    },
    { 
      icon: Clock, 
      label: "Study Time", 
      value: "12h", 
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30",
      change: "This week"
    },
    { 
      icon: Target, 
      label: "Goals Met", 
      value: "3/4", 
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30",
      change: "75% complete"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`}></div>
          <CardContent className="relative p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
