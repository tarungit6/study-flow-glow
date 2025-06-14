
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { InstructorNav } from '@/components/instructor/InstructorNav';
import { InstructorOverview } from '@/components/instructor/InstructorOverview';

export default function InstructorDashboard() {
  const location = useLocation();
  // Only show overview when on exact /instructor path, not on subpages
  const isIndex = location.pathname === '/instructor';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Manage your educational content and assessments</p>
          </div>
        </div>
        
        <InstructorNav />
        {isIndex ? (
          <InstructorOverview />
        ) : (
          <Outlet />
        )}
        {/* Only one of overview or the nested page will show at a time */}
      </div>
    </Layout>
  );
}

