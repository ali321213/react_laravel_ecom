// This hook exposes just the cart item count (for navbar badge etc.).
// It is a very small wrapper over the Redux selector selectCartCount.

import { useAppSelector } from "../app/hooks";
import { selectCartCount } from "../features/cart/cartSlice";

// We keep the same return shape as before: `{ data: cartCount }`
// so components like Navbar do not need to change.
export const useCartCount = () => {
  const count = useAppSelector(selectCartCount);
  return { data: count };
};
