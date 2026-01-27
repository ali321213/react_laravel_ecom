// This is the main App component.
// It sets up routing (URLs) and also restores the authenticated user on refresh.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import CustomerLogin from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
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
import AdminProductsPage from "./pages/admin/Products";
import VendorDashboard from "./pages/vendor/Dashboard";
import CustomerLayout from "./components/layout/CustomerLayout";
import AdminLayout from "./components/layout/AdminLayout";
import VendorLayout from "./components/layout/VendorLayout";

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
      {/* Global toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Guest-only routes (only for users who are NOT logged in) */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <CustomerLogin />
            </GuestRoute>
          }
        />
        <Route
          path="/admin/login"
          element={
            <GuestRoute>
              <AdminLogin />
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

        {/* Customer layout and routes */}
        <Route element={<CustomerLayout />}>
          {/* Public + protected customer pages */}
          <Route path="/" element={<Home />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin routes wrapped in AdminLayout + AdminRoute */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
        </Route>

        {/* Vendor routes wrapped in VendorLayout + VendorRoute */}
        <Route
          path="/vendor"
          element={
            <VendorRoute>
              <VendorLayout />
            </VendorRoute>
          }
        >
          <Route path="dashboard" element={<VendorDashboard />} />
        </Route>

        {/* Fallback: if no route matches, show Home page */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
