import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoursesTab } from '@/components/dashboard/CoursesTab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/useAuth';
import { useEnrollments } from '@/hooks/api/useCourses';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: enrollments } = useEnrollments();
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false);

  // Calculate overall progress
  const totalCourses = enrollments?.length || 0;
  const completedCourses = enrollments?.filter(e => e.progress_percentage === 100).length || 0;
  const overallProgress = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  const generateEmbeddings = async () => {
    setIsGeneratingEmbeddings(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-embeddings');
      
      if (error) {
        console.error('Error generating embeddings:', error);
        toast.error('Failed to generate embeddings');
      } else {
        console.log('Embeddings generated successfully:', data);
        toast.success(`Successfully generated embeddings! Processed: ${data.processed}, Errors: ${data.errors}`);
      }
    } catch (error) {
      console.error('Error calling generate-embeddings function:', error);
      toast.error('Failed to call embedding generation function');
    } finally {
      setIsGeneratingEmbeddings(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-6 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.full_name || 'Student'}!</h1>
            <p className="text-muted-foreground">Track your learning progress and continue your journey.</p>
          </div>
          <Button 
            onClick={generateEmbeddings}
            disabled={isGeneratingEmbeddings}
            variant="outline"
            size="sm"
          >
            {isGeneratingEmbeddings ? 'Generating...' : 'Generate AI Embeddings'}
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
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
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>
        
        <TabsContent value="progress">
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
        
        <TabsContent value="achievements">
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
