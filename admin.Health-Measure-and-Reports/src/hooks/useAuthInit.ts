import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, setUser } from "../redux/features/auth/authSlice";

export const useAuthInit = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  console.log("🔧 useAuthInit: Hook called - user:", user);

  useEffect(() => {
    console.log("🔧 useAuthInit: useEffect running");
    const token = localStorage.getItem("token");
    console.log(
      "🔧 useAuthInit: Token from localStorage:",
      token ? "EXISTS" : "NOT_FOUND",
    );
    console.log("🔧 useAuthInit: Current user:", user);

    // If we have a token but no user in Redux, try to restore from localStorage
    if (token && !user) {
      console.log(
        "🔄 useAuthInit: Found token but no user in Redux - PROCEEDING TO DECODE",
      );

      // For now, we'll need the user profile API to get user data
      // But let's try a simpler approach - decode the JWT token
      try {
        console.log("🔧 useAuthInit: Attempting to split token...");
        const tokenParts = token.split(".");
        console.log("🔧 useAuthInit: Token parts count:", tokenParts.length);

        if (tokenParts.length === 3) {
          console.log("🔧 useAuthInit: Attempting to decode payload...");
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("🔍 useAuthInit: Decoded token payload:", payload);

          // Reconstruct user object from token
          if (payload.user_id && payload.email && payload.name) {
            console.log(
              "🔧 useAuthInit: Token has required fields - constructing user data",
            );
            const userData = {
              id: payload.user_id,
              email: payload.email,
              name: payload.name,
              role: payload.role || "User",
              is_active: payload.is_active ?? true,
              profile_photo: payload.profile_photo || "",
              last_login: payload.last_login
                ? typeof payload.last_login === "string"
                  ? payload.last_login
                  : String(payload.last_login)
                : new Date().toISOString(), // Force string conversion
            };

            console.log("✅ useAuthInit: Restoring user from token:", userData);
            console.log("🔧 useAuthInit: About to dispatch setUser...");
            dispatch(setUser({ user: userData, token }));
            console.log("🔧 useAuthInit: Dispatch completed");
          } else {
            console.warn(
              "⚠️ useAuthInit: Token payload missing required fields:",
              {
                has_user_id: !!payload.user_id,
                has_email: !!payload.email,
                has_name: !!payload.name,
              },
            );
          }
        } else {
          console.warn("⚠️ useAuthInit: Invalid token format - not 3 parts");
        }
      } catch (error) {
        console.error("❌ useAuthInit: Failed to decode token:", error);
        // If token is invalid, remove it
        console.log(
          "🔧 useAuthInit: Token decode failed - removing invalid token",
        );
        localStorage.removeItem("token");
      }
    } else if (token && user) {
      console.log(
        "✅ useAuthInit: Token and user both exist - no action needed",
      );
    } else if (!token && !user) {
      console.log(
        "ℹ️ useAuthInit: No token and no user - normal unauthenticated state",
      );
    } else {
      console.log("🔧 useAuthInit: Edge case - user exists but no token");
    }
  }, [dispatch, user]);

  return { user };
};
