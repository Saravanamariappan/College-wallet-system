import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentWallet from "./pages/student/StudentWallet";
import StudentPay from "./pages/student/StudentPay";
import StudentHistory from "./pages/student/StudentHistory";
import StudentSettings from "./pages/student/StudentSettings";

import VendorDashboard from "./pages/vendor/VendorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const roleToPath = (role?: string) => {
  if (!role) return "/";
  return `/${role.toLowerCase()}`;
};

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRole: string;
}> = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role?.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to={roleToPath(user?.role)} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Initializing app...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={roleToPath(user?.role)} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* STUDENT */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentWallet />} />
        <Route path="wallet" element={<StudentWallet />} />
        <Route path="pay" element={<StudentPay />} />
        <Route path="history" element={<StudentHistory />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* VENDOR */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute allowedRole="vendor">
            <VendorDashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
