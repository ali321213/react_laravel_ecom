// frontend/src/pages/Home.tsx
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FiShoppingCart, FiSearch, FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
// import { addToCart } from "../api/cart";
// import { useMutation } from "@tanstack/react-query";
import { addToCart } from "../services/cart";

export default function Home() {
  /* ✅ ALL HOOKS AT TOP */
  const { user, isAdmin, isVendor, isCustomer } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  function ProfileDropdown({ user }: { user: any }) {
    const [open, setOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 focus:outline-none"
        >
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

        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Profile
            </Link>
            <Link
              to="/orders"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Orders
            </Link>
            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
              <FiLogOut />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8 bg-gray-900 text-white">
          {/* Logo */}
          <div className="flex flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <img
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Search Bar */}
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

          {/* Right Section */}
          <div className="flex flex-1 justify-end items-center gap-6">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <FiShoppingCart className="text-2xl" />
              <span className="absolute -top-2 -right-2 bg-indigo-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Profile */}
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

      {/* Hero */}
      <main className="relative isolate px-6 pt-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Build your online business
          </h1>
          <p className="mt-6 text-lg text-gray-400">
            Powerful tools to manage products, vendors, and customers in one
            place.
          </p>

          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              to="#"
              className="rounded-md bg-indigo-500 px-4 py-2.5 font-semibold hover:bg-indigo-400"
            >
              Get started
            </Link>
            <Link
              to="#"
              className="rounded-md px-4 py-2.5 font-semibold border border-white/30 hover:border-white"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </main>

      {/* Dashboard Section */}
      <section className="text-center space-y-4">
        {/* <h2 className="text-2xl font-semibold">
          Welcome {user?.name}
        </h2> */}

        {isAdmin && <p className="text-indigo-400">Admin Dashboard</p>}
        {isVendor && <p className="text-green-400">Vendor Dashboard</p>}
        {isCustomer && <p className="text-yellow-400">Shop Products</p>}
      </section>

      {/* MAIN CONTENT */}
      {isLoading ? (
        <p className="text-center mt-32 text-lg">Loading products...</p>
      ) : (
        <>
          {/* Dashboard Section */}
          <section className="mt-20 text-center space-y-4">
            {isAdmin && <p className="text-indigo-400">Admin Dashboard</p>}
            {isVendor && <p className="text-green-400">Vendor Dashboard</p>}
            {isCustomer && <p className="text-yellow-400">Shop Products</p>}
          </section>

          {/* Products by Category */}
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
              {Object.entries(data || {}).map(([category, products]: any) => (
                <div key={category} className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {category}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                      <div
                        key={product.id}
                        className="border rounded-lg p-4 hover:shadow-lg"
                      >
                        <img
                          src={
                            product.image || "https://via.placeholder.com/300"
                          }
                          className="h-48 w-full object-cover rounded"
                        />

                        <h3 className="mt-3 font-semibold text-gray-900">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Sold by {product.vendor?.user?.name}
                        </p>

                        <p className="mt-2 font-bold text-indigo-600">
                          ${product.price}
                        </p>

                        <button onClick={() => addToCart(product.id)}
                        className="mt-3 w-full font-bold bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500">
                        Add to Cart{" "}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
