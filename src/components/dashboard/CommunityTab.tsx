
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Hash, Dot } from "lucide-react";

export function CommunityTab() {
  const studySpaces = [
    {
      name: "Mathematics Hub",
      description: "Advanced calculus and algebra discussions",
      members: 247,
      online: 34,
      channels: [
        { name: "general", unread: 0, type: "text" },
        { name: "homework-help", unread: 5, type: "text" },
        { name: "study-groups", unread: 2, type: "text" },
      ]
    },
    {
      name: "CS Collective",
      description: "Programming, algorithms, and data structures",
      members: 312,
      online: 58,
      channels: [
        { name: "general", unread: 3, type: "text" },
        { name: "code-review", unread: 8, type: "text" },
        { name: "projects", unread: 1, type: "text" },
      ]
    },
    {
      name: "Physics Lab",
      description: "Quantum mechanics and lab experiments",
      members: 189,
      online: 23,
      channels: [
        { name: "general", unread: 0, type: "text" },
        { name: "lab-reports", unread: 4, type: "text" },
        { name: "theory-discussion", unread: 0, type: "text" },
      ]
    }
  ];

  const globalChannels = [
    { name: "announcements", description: "Important updates and news", unread: 1, members: 1247 },
    { name: "study-buddy-finder", description: "Find your perfect study partner", unread: 12, members: 892 },
    { name: "motivation-station", description: "Daily inspiration and support", unread: 5, members: 654 },
    { name: "achievement-showcase", description: "Celebrate your wins!", unread: 8, members: 433 },
  ];

  const recentShoutouts = [
    { user: "Sarah M.", achievement: "completed a 10-day study streak", time: "2h ago" },
    { user: "Mike R.", achievement: "scored 98% on Advanced Calculus quiz", time: "4h ago" },
    { user: "Emma L.", achievement: "helped 5 students with homework", time: "6h ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm text-muted-foreground">Active Students</div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">115</div>
            <div className="text-sm text-muted-foreground">Online Now</div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-muted-foreground">Study Groups</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Spaces */}
        <div className="space-y-6">
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                My Study Spaces
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studySpaces.map((space, index) => (
                <div key={index} className="p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{space.name}</h4>
                      <p className="text-sm text-muted-foreground">{space.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Dot className="w-4 h-4 text-green-500" />
                      {space.online}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{space.members} members</span>
                  </div>
                  
                  <div className="space-y-1">
                    {space.channels.map((channel, channelIndex) => (
                      <div key={channelIndex} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Hash className="w-3 h-3" />
                          <span>{channel.name}</span>
                        </div>
                        {channel.unread > 0 && (
                          <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            {channel.unread}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Global Channels */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Global Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {globalChannels.map((channel, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4" />
                    <div>
                      <p className="font-medium text-sm">{channel.name}</p>
                      <p className="text-xs text-muted-foreground">{channel.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{channel.members}</span>
                    {channel.unread > 0 && (
                      <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {channel.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Community Activity */}
        <div className="space-y-6">
          {/* Recent Shoutouts */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle>🎉 Community Shoutouts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentShoutouts.map((shoutout, index) => (
                <div key={index} className="p-3 rounded-lg bg-background/50">
                  <p className="text-sm">
                    <span className="font-medium">{shoutout.user}</span> {shoutout.achievement}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{shoutout.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gradient-primary border-0 text-white">
                <Users className="w-4 h-4 mr-2" />
                Find Study Buddy
              </Button>
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask a Question
              </Button>
              <Button variant="outline" className="w-full">
                <Hash className="w-4 h-4 mr-2" />
                Join Study Group
              </Button>
            </CardContent>
          </Card>

          {/* Study Groups You Might Like */}
          <Card className="gradient-card border-0">
            <CardHeader>
              <CardTitle>Suggested Study Groups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-background/50">
                <h4 className="font-medium text-sm">Calculus Study Circle</h4>
                <p className="text-xs text-muted-foreground">Based on your recent activity in Advanced Math</p>
                <Button size="sm" variant="outline" className="mt-2">Join Group</Button>
              </div>
              <div className="p-3 rounded-lg bg-background/50">
                <h4 className="font-medium text-sm">Late Night Learners</h4>
                <p className="text-xs text-muted-foreground">For students who prefer evening study sessions</p>
                <Button size="sm" variant="outline" className="mt-2">Join Group</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
