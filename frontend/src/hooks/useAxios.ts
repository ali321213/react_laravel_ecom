// frontend\src\hooks\useAxios.ts
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export const useAuth = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  return {
    user,
    isLoggedIn: !!token,
    isAdmin: user?.role === "admin",
    isVendor: user?.role === "vendor",
    isCustomer: user?.role === "customer",
  };
};
