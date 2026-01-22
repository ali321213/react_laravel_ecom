// frontend/src/routes/GuestRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type GuestRouteProps = {
  children: JSX.Element;
};

export function GuestRoute({ children }: GuestRouteProps) {
  const { user } = useAuth();

  // If logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
