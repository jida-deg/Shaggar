console.log("Copilot test working");

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin } from "../../API/axios";
import "../../assets/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await loginAdmin(formData);

      localStorage.setItem("sst_token", response.data.token);
      localStorage.setItem("sst_admin", JSON.stringify(response.data.admin));

      setMessage("Login successful");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Admin Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          {message && <p className="message">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="register-link">
            Don't have an account? <Link to="/admin/register">Create First Admin</Link>
          </p>
          <p>
              <Link to="/admin/forgot-password"> Forgot Password? </Link>
          </p>
          <p className="register-link">
              Contact physically Super Admin to create an account
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;