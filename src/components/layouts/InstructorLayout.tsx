import { Outlet } from 'react-router-dom';
import { InstructorNav } from '@/components/instructor/InstructorNav';

export function InstructorLayout() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <InstructorNav />
      <Outlet />
    </div>
  );
} 