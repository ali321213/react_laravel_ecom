// frontend/src/routes/AdminRoutes.tsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, token } = useSelector((state: any) => state.auth);

  if (!token) return <Navigate to="/admin/login" replace />;

  if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
