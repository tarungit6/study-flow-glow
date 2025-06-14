
import React from 'react';
// Removed useLocation and Outlet from react-router-dom
import { Layout } from '@/components/Layout';
import { InstructorNav } from '@/components/instructor/InstructorNav';
import { InstructorOverview } from '@/components/instructor/InstructorOverview';

export default function InstructorDashboard() {
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
        <InstructorOverview /> {/* InstructorDashboard now always shows InstructorOverview */}
      </div>
    </Layout>
  );
}
