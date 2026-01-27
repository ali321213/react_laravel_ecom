// frontend\src\pages\admin\Dashboard.tsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useSelector((state: any) => state.auth);

  // 🔒 Protect route
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-700">
          Welcome <span className="font-semibold">{user.name}</span> 👋
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-4 rounded-lg bg-indigo-100">
            <h3 className="font-semibold">Total Users</h3>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>

          <div className="p-4 rounded-lg bg-green-100">
            <h3 className="font-semibold">Total Vendors</h3>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>

          <div className="p-4 rounded-lg bg-yellow-100">
            <h3 className="font-semibold">Total Orders</h3>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
