// frontend/src/routes/AdminRoutes.tsx

// This file creates a protected route that only admins can access

// Import useSelector hook from react-redux
// This lets us read data from the Redux store (global state)
import { useSelector } from "react-redux";

// Import Navigate component from react-router-dom
// Navigate is used to redirect users to another route
import { Navigate } from "react-router-dom";

// This is a React component called AdminRoute
// It receives 'children' as a prop
// 'children' means the component/page that we want to protect
export default function AdminRoute({ children }: { children: JSX.Element }) {

  // useSelector reads data from Redux store
  // (state: any) means we are receiving the entire Redux state
  // state.auth refers to the auth slice
  // We extract user and token from auth state
  const { user, token } = useSelector((state: any) => state.auth);

  // If there is NO token
  // It means the user is NOT logged in
  // So we redirect them to the admin login page
  // 'replace' prevents going back to the previous page using back button
  if (!token) return <Navigate to="/admin/login" replace />;

  // If user exists AND user role is NOT admin
  // It means the user is logged in but not an admin
  // So we redirect them to the home page
  if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If token exists AND user is admin
  // Then we allow access to the protected component
  // 'children' will be rendered (shown on screen)
  return children;
}
