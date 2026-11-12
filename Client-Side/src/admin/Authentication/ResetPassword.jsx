import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/ForgotPassword.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("This password reset link is invalid or has expired.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/admin/reset-password", {
        token,
        password,
      });
      setMessage(response.data.message);
      window.history.replaceState({}, "", window.location.pathname);
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Password</h2>
      <p>Choose a new password with at least 8 characters.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="password"
          placeholder="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          autoComplete="new-password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={8}
          autoComplete="new-password"
          required
        />
        <button type="submit" disabled={loading || !token}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
      <p><Link to="/admin/login">Back to login</Link></p>
    </div>
  );
};

export default ResetPassword;
