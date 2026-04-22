import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { Link as LinkIcon, LogIn, Lock, Mail } from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <div style={{ background: "var(--primary-color)", padding: "1rem", borderRadius: "50%" }}>
              <LinkIcon size={32} color="white" />
            </div>
          </div>
          <h2 className="hero-title" style={{ fontSize: "2rem" }}>Welcome Back</h2>
          <p style={{ color: "#94a3b8" }}>Log in to manage your links</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1.5rem", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: "1rem" }}>
            <LogIn size={20} /> Log In
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", color: "#cbd5e1" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--primary-color)", fontWeight: "600" }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
