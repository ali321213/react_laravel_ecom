// frontend\src\App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Simple, unconditional routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        {/* Fallback route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
