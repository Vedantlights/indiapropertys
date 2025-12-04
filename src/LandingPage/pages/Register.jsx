import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    emailOtp: "",
    phone: "",
    phoneOtp: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSendEmailOtp = () => {
    setEmailOtpSent(true);
    alert("Email OTP sent to: " + formData.email);
  };

  const handleVerifyEmailOtp = () => {
    alert("Verifying email OTP: " + formData.emailOtp);
  };

  const handleSendPhoneOtp = () => {
    setPhoneOtpSent(true);
    alert("Phone OTP sent to: " + formData.phone);
  };

  const handleVerifyPhoneOtp = () => {
    alert("Verifying phone OTP: " + formData.phoneOtp);
  };

  const handleSubmit = () => {
    if (!formData.agreeTerms) {
      alert("Please agree to Terms & Privacy Policy");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Registration successful!");
    console.log("Registration data:", formData);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1 className="title">Create Account</h1>
          <p className="subtitle">Fill in your details to get started</p>
        </div>

        <div className="form">
          {/* Full Name */}
          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="input"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="label">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="input input-pr"
              />
              <button
                type="button"
                className="inline-btn"
                onClick={() => {
                  const email = formData.email.trim();
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                  if (!emailRegex.test(email)) {
                    alert("Please enter a valid email address.");
                    return;
                  }

                  handleSendEmailOtp();
                }}
              >
                {emailOtpSent ? "Resend" : "Send OTP"}
              </button>
            </div>
          </div>

          {emailOtpSent && (
            <div className="form-group fadeIn">
              <label className="label">Email OTP</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="emailOtp"
                  value={formData.emailOtp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  className="input input-pr"
                />
                <button
                  type="button"
                  className="verify-btn"
                  onClick={handleVerifyEmailOtp}
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* Phone */}
          <div className="form-group">
            <label className="label">Phone Number</label>
            <div className="input-wrapper">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="input input-pr"
              />
              <button
                type="button"
                className="inline-btn"
                onClick={() => {
                  const digits = formData.phone.replace(/\D/g, "");

                  let valid = false;

                  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
                    valid = true;
                  }

                  if (digits.length === 12 && digits.startsWith("91")) {
                    const num = digits.slice(2);
                    if (/^[6-9]\d{9}$/.test(num)) valid = true;
                  }

                  if (!valid) {
                    alert("Enter a valid Indian mobile number (10 digits, starts from 6-9).");
                    return;
                  }

                  handleSendPhoneOtp();
                }}
              >
                {phoneOtpSent ? "Resend" : "Send OTP"}
              </button>
            </div>
          </div>

          {phoneOtpSent && (
            <div className="form-group fadeIn">
              <label className="label">Phone OTP</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="phoneOtp"
                  value={formData.phoneOtp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  className="input input-pr"
                />
                <button
                  type="button"
                  className="verify-btn"
                  onClick={handleVerifyPhoneOtp}
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="form-group">
            <label className="label">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-small-pr"
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="label">Confirm Password</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-small-pr"
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                👁
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="checkbox"
            />
            <label htmlFor="agreeTerms" className="checkbox-label">
              I agree to the{" "}
              <a href="terms-conditions" className="link">
                Terms
              </a>{" "}
              &{" "}
              <a href="./privacy-policy" className="link">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Register Button */}
          <button type="button" className="register-btn" onClick={handleSubmit}>
            Register
          </button>

          {/* Login Link */}
          <p className="login-link">
            Already have an account?{" "}
            <button className="link-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;