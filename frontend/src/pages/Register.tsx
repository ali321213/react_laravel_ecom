import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../features/auth/authSlice";
import api from "../services/api";

export default function Register() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    try {
      // Register API
      const res = await api.post("/register", data);

      // Auto login after register
      localStorage.setItem("token", res.data.token);
      dispatch(login.fulfilled(res.data));

      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 transition-colors"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
