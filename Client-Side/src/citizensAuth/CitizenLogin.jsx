import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCitizen } from "./citizenAuth.api";
import "../assets/citizenAuth.css";

const CitizenLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginCitizen(form);
      if (!result.token) {
        throw new Error("Login succeeded but the server returned no token.");
      }

      localStorage.setItem("sst_citizen_token", result.token);
      localStorage.setItem("sst_citizen", JSON.stringify(result.citizen));
      navigate("/citizen/portal", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          requestError.message ??
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="citizen-auth-page">
      <section className="citizen-auth-card">
        <p className="citizen-auth-eyebrow">Citizen Portal</p>
        <h1>Welcome back</h1>
        <p className="citizen-auth-description">
          Sign in to access your citizen account.
        </p>

        {error && <p className="citizen-auth-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="citizen-identifier">Email or phone number</label>
          <input
            id="citizen-identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            value={form.identifier}
            onChange={handleChange}
            required
          />

          <label htmlFor="citizen-password">Password</label>
          <input
            id="citizen-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="citizen-auth-switch">
          New to the portal? <Link to="/citizen/register">Create an account</Link>
        </p>
        <Link className="citizen-auth-home" to="/">Return to home</Link>
      </section>
    </main>
  );
};

export default CitizenLogin;
