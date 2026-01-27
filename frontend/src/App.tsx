// This is the main App component.
// It sets up routing (URLs) and also restores the authenticated user on refresh.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Profile from "./pages/Profile";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { GuestRoute } from "./routes/GuestRoute";
import AdminRoute from "./routes/AdminRoutes";
import VendorRoute from "./routes/VendorRoutes";
import AdminDashboard from "./pages/admin/Dashboard";
import VendorDashboard from "./pages/vendor/Dashboard";

import { me } from "./features/auth/authSlice";

function App() {
  // Get the Redux dispatch function so we can dispatch actions/thunks.
  // Using "any" keeps it simple here, but you could also use AppDispatch type.
  const dispatch = useDispatch<any>();

  // Restore auth on refresh:
  // - When the app loads, we check if a token is stored.
  // - If yes, we dispatch "me" to fetch the logged-in user from backend.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(me());
    }
  }, [dispatch]);

  return (
    // BrowserRouter enables client-side routing (no full page reloads).
    <BrowserRouter>
      <Routes>
        {/* Guest-only routes (only for users who are NOT logged in) */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* Protected routes (only for logged-in users) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Role-based routes (admin/vendor only) */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/vendor/dashboard"
          element={
            <VendorRoute>
              <VendorDashboard />
            </VendorRoute>
          }
        />

        {/* Public routes (anyone can see these) */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* Fallback: if no route matches, show Home page */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
