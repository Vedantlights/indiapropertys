import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Building2, Home } from "lucide-react";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("buyer");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = () => {
    console.log("Login submitted:", { ...formData, userType });
    alert(`Logging in as ${userType}\nEmail: ${formData.email}`);

    // ⭐ ROLE-BASED NAVIGATION
    if (userType === "buyer") {
      navigate("/buyer-dashboard");
    } else if (userType === "seller") {
      navigate("/seller-dashboard");
    } else if (userType === "agent") {
      navigate("/Agent-dashboard");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        <div className="user-type-toggle">
          <button
            onClick={() => setUserType("buyer")}
            className={userType === "buyer" ? "active" : ""}
          >
            <User size={20} /> Buyer/Renter
          </button>

          <button
            onClick={() => setUserType("seller")}
            className={userType === "seller" ? "active" : ""}
          >
            <Home size={20} /> Seller/Rent
          </button>

          <button
            onClick={() => setUserType("agent")}
            className={userType === "agent" ? "active" : ""}
          >
            <Building2 size={20} /> Agent/Builder
          </button>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="options-row">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <button onClick={() => alert("Forgot password clicked")}>
              Forgot Password?
            </button>
          </div>

          <button className="login-btn" onClick={handleSubmit}>
            Sign In
          </button>

          <div className="signup-link">
            Don't have an account?{" "}
            <button onClick={() => navigate("/register")}>Register now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
