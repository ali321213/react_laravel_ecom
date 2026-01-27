// frontend/src/pages/Home.tsx
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";
import { Link } from "react-router-dom";
import { addToCart } from "../services/cart";
import Navbar from "../components/layout/Navbar";

export default function Home() {
  /* ALL HOOKS AT TOP */
  const { isAdmin, isVendor, isCustomer } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />

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

                        <button
                          onClick={() => addToCart(product.id)}
                          className="mt-3 w-full font-bold bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500"
                        >
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
