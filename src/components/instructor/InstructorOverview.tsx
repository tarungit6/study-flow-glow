
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Video, FileText, TrendingUp } from 'lucide-react';

export function InstructorOverview() {
  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Students',
      value: '245',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Content Uploaded',
      value: '18',
      change: '+3 this week',
      icon: Video,
      color: 'text-green-600'
    },
    {
      title: 'Tests Created',
      value: '8',
      change: '+2 this month',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      title: 'Engagement Rate',
      value: '87%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const recentContent = [
    {
      title: 'Introduction to Algebra',
      type: 'YouTube Video',
      subject: 'Mathematics',
      status: 'published',
      views: 156
    },
    {
      title: 'Chemical Reactions Quiz',
      type: 'Test',
      subject: 'Science',
      status: 'draft',
      attempts: 0
    },
    {
      title: 'Shakespeare Analysis',
      type: 'YouTube Playlist',
      subject: 'English',
      status: 'published',
      views: 89
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Content</CardTitle>
            <CardDescription>Your latest uploads and tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{content.title}</h4>
                      <Badge variant={content.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                        {content.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{content.type}</span>
                      <span>•</span>
                      <span>{content.subject}</span>
                      <span>•</span>
                      <span>{content.views ? `${content.views} views` : `${content.attempts} attempts`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for content management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <h4 className="font-medium text-sm mb-1">Upload YouTube Video</h4>
                <p className="text-xs text-muted-foreground">Add educational content from YouTube</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <h4 className="font-medium text-sm mb-1">Create New Test</h4>
                <p className="text-xs text-muted-foreground">Design assessments for your students</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <h4 className="font-medium text-sm mb-1">View Analytics</h4>
                <p className="text-xs text-muted-foreground">Check student engagement and progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Content Distribution</CardTitle>
          <CardDescription>Your content across different subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mathematics</span>
              <span className="text-sm text-muted-foreground">8 items</span>
            </div>
            <Progress value={65} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Science</span>
              <span className="text-sm text-muted-foreground">6 items</span>
            </div>
            <Progress value={45} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">English</span>
              <span className="text-sm text-muted-foreground">4 items</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
