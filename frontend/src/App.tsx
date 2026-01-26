import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { GuestRoute } from "./routes/GuestRoute";
import AdminRoute from "./routes/AdminRoutes";
import VendorRoute from "./routes/VendorRoutes";
import AdminDashboard from "./pages/admin/Dashboard";
import VendorDashboard from "./pages/vendor/Dashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest-only pages */}
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

        {/* Protected pages (user must be logged in) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Public pages */}
        <Route path="/ProductDetail" element={<ProductDetail />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/Profile" element={<Profile />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
