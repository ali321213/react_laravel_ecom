// This is the login page.
// It submits email/password to Redux (login thunk) and then redirects based on user role.

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../features/auth/authSlice";
import { redirectByRole } from "../../utils/redirectByRole";

export default function Login() {
  // Get dispatch to send the login action.
  const dispatch = useDispatch<any>();

  // useNavigate to redirect after successful login.
  const navigate = useNavigate();

  // Read current user from Redux (set after successful login or "me").
  const { user } = useSelector((state: any) => state.auth);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get values from the form fields.
    const form = e.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    // Dispatch Redux thunk to call /login API and update auth state.
    dispatch(login({ email, password }));
  };

  // Role-based redirect:
  // When user changes (after login), if user has a role,
  // we show a toast, compute where to go, and navigate.
  useEffect(() => {
    if (user?.role) {
      toast.success("Successfully logged in 🎉");
      alert("Role: " + user.role);
      const redirectPath = redirectByRole(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Form container */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <div className="space-y-4">
          {/* Email input */}
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-2"
          />

          {/* Password input */}
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        {/* Submit button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>

        {/* Link to register page */}
        <p className="text-center text-sm">
          No account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
