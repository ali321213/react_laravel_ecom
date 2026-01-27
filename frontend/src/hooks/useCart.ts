// frontend/src/hooks/useCart.ts
import { useEffect, useState } from "react";
import { fetchCart, updateCartItem, removeCartItem } from "../services/cart";
import { useAuth } from "./useAuth";

export function useCart() {
  const { isLoggedIn } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchCart()
      .then(setCart)
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const updateQuantity = async (itemId: number, qty: number) => {
    if (qty < 1) return;
    const updated = await updateCartItem(itemId, qty);
    setCart(updated);
  };

  const removeItem = async (itemId: number) => {
    const updated = await removeCartItem(itemId);
    setCart(updated);
  };

  const subtotal =
    cart?.items.reduce(
      (sum: number, i: any) => sum + Number(i.price) * i.quantity,
      0
    ) ?? 0;

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const count =
    cart?.items.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0;

  return {
    cart,
    loading,
    subtotal,
    tax,
    total,
    count,
    updateQuantity,
    removeItem,
  };
}
