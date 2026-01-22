// frontend\src\pages\Login.tsx
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch<any>();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    dispatch(
      login({
        email: e.target.email.value,
        password: e.target.password.value,
      })
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />

      <button>Login</button>

      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
