import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { InstructorLayout } from '@/components/layouts/InstructorLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const InstructorDashboard = lazy(() => import('@/pages/instructor/InstructorDashboard'));
const CreateTest = lazy(() => import('@/pages/instructor/CreateTest'));

export const instructorRoutes = (
  <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
    <Route element={<InstructorLayout />}>
      <Route index element={<InstructorDashboard />} />
      <Route path="create-test" element={<CreateTest />} />
    </Route>
  </Route>
); 