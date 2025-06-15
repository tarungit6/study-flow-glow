
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCourses } from '@/hooks/api/useCourses';

export default function InstructorDashboard() {
  const { data: courses, isLoading } = useCourses();

  const publishedCourses = React.useMemo(() => {
    if (!courses) return [];
    return courses.filter(course => course.is_published);
  }, [courses]);

  const draftCourses = React.useMemo(() => {
    if (!courses) return [];
    return courses.filter(course => !course.is_published);
  }, [courses]);

  // Since educational_content doesn't have enrollments, we'll use a placeholder
  const totalEnrollments = 0; // This would need to be calculated differently

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCourses.length}</div>
            <CardDescription>Active courses available to students</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCourses.length}</div>
            <CardDescription>Courses in development</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <CardDescription>Students enrolled in your courses</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
