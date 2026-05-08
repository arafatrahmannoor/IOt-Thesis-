import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/shared/Loading";
import { useAuthInit } from "../hooks/useAuthInit";
import {
  logout,
  selectCurrentUser,
  setProfile,
  setRole,
} from "../redux/features/auth/authSlice";
import { useMyProfileQuery } from "../redux/features/user/userApi";

interface ProtectedRouteProps {
  roles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  
  // Initialize auth from localStorage if needed
  useAuthInit();
  
  console.log("🛡️ ProtectedRoute - TIMESTAMP:", new Date().toISOString());
  console.log("🛡️ ProtectedRoute - User in Redux:", user);
  console.log("🛡️ ProtectedRoute - Token in localStorage:", localStorage.getItem('token') ? 'EXISTS' : 'NOT_FOUND');
  console.log("🛡️ ProtectedRoute - Location:", location.pathname);
  console.log("🛡️ ProtectedRoute - Required roles:", roles);
  
  const { data, isLoading, error } = useMyProfileQuery(undefined, {
    skip: true // Temporarily disable profile API call to fix auth flow
  });

  console.log("🛡️ ProtectedRoute - Profile API:", { 
    data, 
    isLoading, 
    error: error?.toString(),
    skipCondition: !user || !localStorage.getItem('token'),
    hasUser: !!user,
    hasToken: !!localStorage.getItem('token')
  });

  // Handle side effects in useEffect to avoid setState during render
  useEffect(() => {
    if (data?.data?.profile_photo && data.data.profile_photo !== user?.profile_photo) {
      dispatch(setProfile(data.data.profile_photo));
    }
    if (data?.data?.role && data.data.role !== user?.role) {
      dispatch(setRole(data.data.role));
    }
  }, [data, dispatch, user]);

  // Handle account deactivation
  useEffect(() => {
    if (data?.data && data.data.is_active === false) {
      dispatch(logout());
      localStorage.removeItem('token');
    }
  }, [data, dispatch]);

  // First check: No user in Redux store
  if (!user) {
    console.log("❌ ProtectedRoute - No user in Redux, redirecting to login");
    // Give a small delay before redirecting to allow Redux state to settle
    const hasToken = localStorage.getItem('token');
    if (hasToken) {
      console.log("⚠️ ProtectedRoute - Token exists but no user in Redux, waiting...");
      return <Loading text="Initializing user session..." />;
    }
    return <Navigate to="/login" replace />;
  }

  // Second check: Profile API loading state disabled - skip this entirely
  // We proceed with stored user data from JWT token

  // Third check: Profile API error (token might be invalid) - but only if we tried to fetch
  if (error && localStorage.getItem('token')) {
    console.warn('🚨 ProtectedRoute - Profile fetch error, but continuing with stored user data:', error);
    // Don't log out immediately, just log the warning
    // This allows the app to work even if the profile API fails
  }

  console.log("🔍 ProtectedRoute - After profile error check, proceeding to role check...");

  // Fourth check: Account is deactivated (only if we have profile data)
  if (data?.data && data.data.is_active === false) {
    return <Navigate to="/login" state={{ from: location, message: "Account deactivated" }} replace />;
  }

  // Fifth check: Role-based access control
  console.log("🎯 ProtectedRoute - Starting role check section");
  console.log("🔍 ProtectedRoute - Role check inputs:", { 
    roles, 
    rolesLength: roles?.length,
    hasRoles: !!(roles && roles.length > 0),
    userData: data?.data,
    userFromState: user 
  });
  
  if (roles && roles.length > 0) {
    const userRole = data?.data?.role || user?.role;
    console.log("🔐 ProtectedRoute - Role check:", { requiredRoles: roles, userRole });
    if (!userRole || !roles.includes(userRole)) {
      console.log("❌ ProtectedRoute - Insufficient role, redirecting to 404");
      return <Navigate to="/404" replace />;
    }
    console.log("✅ ProtectedRoute - Role check passed!");
  } else {
    console.log("ℹ️ ProtectedRoute - No role requirements, skipping role check");
  }

  // Success: User is authenticated and authorized
  console.log("✅ ProtectedRoute - All checks passed, rendering children");
  console.log("🎯 ProtectedRoute - Final state:", { 
    hasUser: !!user, 
    userRole: user?.role, 
    requiredRoles: roles,
    location: location.pathname 
  });
  return <>{children}</>;
};

export default ProtectedRoute;
