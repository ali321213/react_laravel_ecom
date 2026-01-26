// frontend\src\pages\Profile.tsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { user } = useSelector((state: any) => state.auth);

  // 🔒 Protect route
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Profile Page</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-700">
          Welcome <span className="font-semibold">{user.name}</span> 👋
        </p>
      </div>
    </div>
  );
}
