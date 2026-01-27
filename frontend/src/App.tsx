// frontend/src/App.tsx
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
  const dispatch = useDispatch<any>();

  // Restore auth on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(me());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Guest-only routes */}
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

        {/* Protected routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Role-based routes */}
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

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
