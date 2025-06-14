
import React from 'react';
import { Link } from 'react-router-dom';
import { useAssignments } from '@/hooks/api/useAssignments';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const statusColors: { [key: string]: string } = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Submitted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Graded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function Assignments() {
  const { assignments, isLoading, error } = useAssignments();

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 dark:text-gray-300 text-sm">
                {[...Array(5)].map((_, i) => <th key={i} className="pb-2"><Skeleton className="h-4 w-20" /></th>)}
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, i) => (
                <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                  {[...Array(5)].map((_, j) => <td key={j} className="py-3"><Skeleton className="h-5 w-24" /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load assignments: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const assignmentsList = assignments?.map(a => ({
    id: a.id,
    title: a.title,
    course: a.course?.title || 'N/A',
    due: a.due_date ? formatDistanceToNow(new Date(a.due_date), { addSuffix: true }) : 'N/A',
    status: a.status || 'published',
  })) || [];

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition">Back to Home</Link>
      </div>
      <div className="bg-card text-card-foreground rounded-xl shadow p-6">
        {assignmentsList.length === 0 && !isLoading ? (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>No Assignments</AlertTitle>
            <AlertDescription>
              You have no pending or submitted assignments at the moment.
            </AlertDescription>
          </Alert>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted-foreground text-sm">
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Course</th>
                <th className="pb-2 font-medium">Due</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignmentsList.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="py-3 font-medium text-card-foreground">{a.title}</td>
                  <td className="py-3 text-muted-foreground">{a.course}</td>
                  <td className="py-3 text-muted-foreground">{a.due}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[a.status] || statusColors.Pending}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition text-xs">
                      {a.status === 'published' ? 'Submit' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
