// frontend\src\App.tsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { me } from "./features/auth/authSlice";
import { useAuth } from "./hooks/useAuth";

function App() {
  const dispatch = useDispatch<any>();
  const { isLoggedIn } = useAuth();

  // Load user if token exists
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(me());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/" />} />
        {/* Protected Routes */}
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
