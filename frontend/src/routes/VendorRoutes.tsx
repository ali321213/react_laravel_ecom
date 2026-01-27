// frontend/src/routes/VendorRoutes.tsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function VendorRoute({ children }: { children: JSX.Element }) {
  const { user, token } = useSelector((state: any) => state.auth);

  if (!token) return <Navigate to="/admin/login" replace />;

  if (user && user.role !== "vendor") {
    return <Navigate to="/" replace />;
  }

  return children;
}
