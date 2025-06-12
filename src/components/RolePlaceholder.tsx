
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Construction } from 'lucide-react';

interface RolePlaceholderProps {
  role: string;
  title: string;
  description: string;
}

export function RolePlaceholder({ role, title, description }: RolePlaceholderProps) {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <Construction className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Current Role:</strong> {profile?.role || 'Unknown'}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>User:</strong> {profile?.full_name || 'Unknown User'}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            This dashboard is coming soon. We're building amazing features for {role}s!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
