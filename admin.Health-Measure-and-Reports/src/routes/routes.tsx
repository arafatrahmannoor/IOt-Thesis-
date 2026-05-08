import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Login from "../pages/AuthPages/Login";
import ForgetPassword from "../pages/AuthPages/ForgetPassword";
import NotFound from "../pages/OtherPage/NotFound";
import Profile from "../pages/Profile/Profile";
import ResetPassword from "../pages/AuthPages/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import HealthMonitor from "../pages/HealthMonitor/HealthMonitor";
import Reports from "../pages/Reports/Reports";
import History from "../pages/History/History";
import ReportDetails from "../pages/ReportDetails/ReportDetails";
import ProtectedRoute from "./ProtectedRoute";

const routes = [
  // Temporary standalone route to test login without ProtectedRoute
  {
    path: "/dashboard-direct",
    element: <Dashboard />, // Direct dashboard without layout for testing
  },
  
  {
    path: "/",
    element: (
      <ProtectedRoute roles={["Super Admin", "Admin", "Editor", "Publisher"]}>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      // Dashboard & Core
      { path: "/", element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> }, // Add explicit dashboard route
      { path: "/health-monitor", element: <HealthMonitor /> },
      { path: "/reports", element: <Reports /> },
      { path: "/reports/:id", element: <ReportDetails /> },
      { path: "/reports/new", element: <ReportDetails /> },
      { path: "/history", element: <History /> },
      { path: "/profile", element: <Profile /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },

  // Global fallback routes
  { path: "/404", element: <NotFound /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgetPassword /> },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
  } as any,
});

export default router;
