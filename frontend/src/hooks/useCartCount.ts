// frontend\src\hooks\useCartCount.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCartCount } from "../services/cart";

export const useCartCount = () => {
  return useQuery({
    queryKey: ["cart-count"],
    queryFn: fetchCartCount,
    staleTime: 1000 * 30, // 30 seconds
  });
};
