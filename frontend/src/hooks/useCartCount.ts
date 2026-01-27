// frontend\src\hooks\useCartCount.ts
import { useAppSelector } from "../app/hooks";
import { selectCartCount } from "../features/cart/cartSlice";

// Keep the same return signature `{ data: cartCount }`
export const useCartCount = () => {
  const count = useAppSelector(selectCartCount);
  return { data: count };
};
