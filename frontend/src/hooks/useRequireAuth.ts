// frontend/src/hooks/useRequireAuth.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export function useRequireAuth(role?: "admin" | "vendor" | "customer") {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    if (role && user?.role !== role) {
      if (user?.role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (user?.role === "vendor") navigate("/vendor/dashboard", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [isLoggedIn, role, user, navigate]);
}
