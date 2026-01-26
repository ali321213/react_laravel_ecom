// frontend/src/pages/Cart.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { fetchCart, updateCartItem, removeCartItem } from "../services/cart";

/* ---------------- TYPES ---------------- */

type Product = {
  name: string;
  image?: string;
};

type CartItem = {
  id: number;
  quantity: number;
  price: number;
  product: Product;
};

type Cart = {
  id: number;
  items: CartItem[];
};

/* ---------------- COMPONENT ---------------- */

export default function Cart() {
  const { user, isCustomer } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH CART ---------- */
  useEffect(() => {
    fetchCart()
      .then((res) => setCart(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- UPDATE QUANTITY ---------- */
  const updateQuantity = async (itemId: number, qty: number) => {
    if (qty < 1) return;

    await updateCartItem(itemId, qty);

    setCart((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((item) =>
              item.id === itemId ? { ...item, quantity: qty } : item,
            ),
          }
        : prev,
    );
  };

  /* ---------- REMOVE ITEM ---------- */
  const removeItem = async (itemId: number) => {
    await removeCartItem(itemId);

    setCart((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.filter((item) => item.id !== itemId),
          }
        : prev,
    );
  };

  /* ---------- TOTALS ---------- */
  const subtotal =
    cart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  /* ---------- UI ---------- */
  if (loading) {
    return <p className="p-6">Loading cart...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {!cart || cart.items.length === 0 ? (
          <p className="text-gray-600">
            Your cart is empty.{" "}
            <Link to="/" className="text-indigo-600 hover:underline">
              Shop now
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white p-4 rounded shadow"
                >
                  <img
                    src={item.product.image || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold">{item.product.name}</h2>
                    {/* <p className="text-gray-600">
                      ${item.price.toFixed(2)}
                    </p> */}
                    <p className="text-gray-600">
                      ${Number(item.price).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 bg-gray-200 rounded"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {user && isCustomer && (
          <p className="mt-6 text-gray-700">
            Hello <span className="font-semibold">{user.name}</span>, ready to
            complete your order?
          </p>
        )}
      </div>
    </div>
  );
}
