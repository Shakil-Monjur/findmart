
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../services/api";
import "../../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        alert("Login successful!");
        if (data.user.role === "Shop Owner") {
          navigate("/shop-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert(error.message || "An error occurred during login");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Log In to FindMart</h2>
        <p className="auth-subtitle">Welcome back! Please enter your details.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Log In
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/signup" className="auth-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;