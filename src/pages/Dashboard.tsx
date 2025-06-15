
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoursesTab } from '@/components/dashboard/CoursesTab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/auth/useAuth';
import { useEnrollments } from '@/hooks/api/useCourses';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: enrollments } = useEnrollments();

  // Calculate overall progress
  const totalCourses = enrollments?.length || 0;
  const completedCourses = enrollments?.filter(e => e.progress_percentage === 100).length || 0;
  const overallProgress = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.full_name || 'Student'}!</h1>
        <p className="text-muted-foreground">Track your learning progress and continue your journey.</p>
      </div>

      {/* Progress Overview */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>Your overall course completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Courses:</span>
                <span className="ml-2 font-medium">{totalCourses}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Completed:</span>
                <span className="ml-2 font-medium">{completedCourses}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="w-full">
          <CoursesTab />
        </TabsContent>
        
        <TabsContent value="progress" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Progress</CardTitle>
              <CardDescription>Track your progress in each course</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add detailed progress content here */}
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your learning milestones and badges</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add achievements content here */}
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
