import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user, isAdmin, isVendor, isCustomer } = useAuth();

  return (
    <div>
      <h1>Welcome  {user?.name}</h1>

      {isAdmin && <p>Admin Dashboard</p>}
      {isVendor && <p>Vendor Dashboard</p>}
      {isCustomer && <p>Shop Products</p>}
    </div>
  );
}
