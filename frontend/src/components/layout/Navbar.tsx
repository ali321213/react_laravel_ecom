// This component renders the top navigation bar (logo, search, cart, profile).
// It also shows a profile dropdown when the user is logged in.

import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch, FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { useAuth } from "../../hooks/useAuth";
import { useCartCount } from "../../hooks/useCartCount";
import { logout } from "../../features/auth/authSlice";

/* ---------------- PROFILE DROPDOWN ---------------- */
function ProfileDropdown({ user }: { user: any }) {
  // Local state to control if dropdown is open or closed.
  const [open, setOpen] = useState(false);

  // Redux dispatch for logout.
  const dispatch = useDispatch();

  // useNavigate for programmatic navigation (redirect after logout).
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Clear auth state in Redux.
    setOpen(false); // Close dropdown UI.
    navigate("/login", { replace: true }); // Go to login page.
  };

  return (
    <div className="relative">
      {/* Button that toggles dropdown open/closed */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 focus:outline-none"
      >
        {/* If user has an avatar, show it, otherwise show generic user icon */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="text-3xl" />
        )}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Profile
          </Link>

          <Link
            to="/orders"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Orders
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- NAVBAR ---------------- */
export default function Navbar() {
  // Get current user info from auth hook (Redux under the hood).
  const { user } = useAuth();

  // Get cart item count from cart hook (Redux selector under the hood).
  const { data: cartCount } = useCartCount();

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8 bg-gray-900 text-white">
        {/* Logo on the left */}
        <div className="flex flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              alt="Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Search bar in the middle (only on md+ screens) */}
        <div className="hidden md:flex items-center w-full max-w-md mx-6">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Right side: cart icon + auth/profile */}
        <div className="flex flex-1 justify-end items-center gap-6">
          {/* Cart link with badge showing item count */}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* If no user, show Login link; otherwise show profile dropdown */}
          {!user ? (
            <Link to="/login" className="text-sm font-semibold">
              Log in →
            </Link>
          ) : (
            <ProfileDropdown user={user} />
          )}
        </div>
      </nav>
    </header>
  );
}
