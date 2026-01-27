// frontend/src/hooks/useCart.ts
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
  const { isLoggedIn } = useAuth();
  const dispatch = useAppDispatch();

  const cart = useAppSelector(selectCart);
  const loading = useAppSelector(selectCartLoading);
  const count = useAppSelector(selectCartCount);
  const { subtotal, tax, total } = useAppSelector(selectCartTotals);

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(fetchCart());
  }, [isLoggedIn, dispatch]);

  const updateQuantity = (itemId: number, qty: number) => {
    if (qty < 1) return;
    dispatch(updateCartItemQuantity({ itemId, quantity: qty }));
  };

  const removeItem = (itemId: number) => {
    dispatch(removeCartItem(itemId));
  };

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
