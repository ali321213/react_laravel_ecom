// This custom hook wraps all cart-related Redux logic into a simple interface.
// Components can call useCart() and get: cart data, totals, and actions.

import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchCart,
  removeCartItem,
  selectCart,
  selectCartCount,
  selectCartLoading,
  selectCartTotals,
  updateCartItemQuantity,
} from "../features/cart/cartSlice";

export function useCart() {
  // Read login status (so we only load cart for logged-in users).
  const { isLoggedIn } = useAuth();

  // Get typed dispatch for calling thunks.
  const dispatch = useAppDispatch();

  // Read pieces of cart state from Redux using selectors.
  const cart = useAppSelector(selectCart);
  const loading = useAppSelector(selectCartLoading);
  const count = useAppSelector(selectCartCount);
  const { subtotal, tax, total } = useAppSelector(selectCartTotals);

  // When user becomes logged in (or on first render if already logged in),
  // fetch the cart from the backend.
  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(fetchCart());
  }, [isLoggedIn, dispatch]);

  // Helper to change quantity of an item.
  const updateQuantity = (itemId: number, qty: number) => {
    // Ignore invalid quantities (0 or negative).
    if (qty < 1) return;
    dispatch(updateCartItemQuantity({ itemId, quantity: qty }));
  };

  // Helper to remove an item entirely from cart.
  const removeItem = (itemId: number) => {
    dispatch(removeCartItem(itemId));
  };

  // Expose all useful values/actions for the UI to use.
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
