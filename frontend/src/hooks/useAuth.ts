// This custom hook makes it easy to read auth information from Redux.
// Instead of writing `useSelector((state) => state.auth)` everywhere,
// we wrap it in a nice helper and also calculate some useful booleans.

import { useSelector } from "react-redux";

export function useAuth() {
  // Grab auth state from Redux store.
  // `state.auth` comes from store.ts where we registered `auth: authReducer`.
  const { user, token, loading } = useSelector((state: any) => state.auth);

  // Return raw data + helpful "flags" (isLoggedIn, isAdmin, etc.)
  return {
    user, // full user object from backend (can contain name, role, etc.)
    token, // JWT token stored after login
    loading, // could be used to show loading spinner during auth calls
    isLoggedIn: !!token, // true if token exists
    isAdmin: user?.role === "admin",
    isVendor: user?.role === "vendor",
    isCustomer: user?.role === "customer",
  };
}
