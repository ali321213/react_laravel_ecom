import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Simple vendor layout with sidebar + header.
export default function VendorLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-indigo-900 text-white flex flex-col">
        <div className="px-4 py-4 text-lg font-bold border-b border-indigo-700">
          Vendor Panel
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <NavLink
            to="/vendor/dashboard"
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm ${
                isActive ? "bg-indigo-700" : "hover:bg-indigo-800"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/vendor/products"
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm ${
                isActive ? "bg-indigo-700" : "hover:bg-indigo-800"
              }`
            }
          >
            Products
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b flex items-center justify-between px-6">
          <h1 className="font-semibold">Welcome, {user?.name ?? "Vendor"}</h1>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
