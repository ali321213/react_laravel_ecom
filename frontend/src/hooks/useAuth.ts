// frontend/src/hooks/useAuth.ts
import { useSelector } from "react-redux";

export function useAuth() {
  const { user, token, loading } = useSelector((state: any) => state.auth);

  return {
    user,
    token,
    loading,
    isLoggedIn: !!token,
    isAdmin: user?.role === "admin",
    isVendor: user?.role === "vendor",
    isCustomer: user?.role === "customer",
  };
}
