import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import UploadContent from "./pages/UploadContent";
import CreateTest from "./pages/CreateTest";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Assignments from "./pages/Assignments";
import Courses from "./pages/Courses";
import Schedule from "./pages/Schedule";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute>
                <Assignments />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            } />

            {/* Role-specific routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['super_admin', 'client_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* INSTRUCTOR DASHBOARD with nested routes */}
            <Route
              path="/instructor"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            >
              {/* Index (overview) */}
              <Route index element={<></>} /> 
              {/* Nested pages (UploadContent and CreateTest) */}
              <Route path="upload" element={<UploadContent />} />
              <Route path="tests" element={<CreateTest />} />
            </Route>
            {/* Note: No longer mounting UploadContent/CreateTest at root level */}

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
