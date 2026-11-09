import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCitizen } from "./citizenAuth.api";
import "../assets/citizenAuth.css";

const CitizenRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    adress: "",
    password: "",
    confirmPassword: "",
  });
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

    if (!form.email.trim() && !form.phone.trim()) {
      setError("Enter either an email address or a phone number.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const email = form.email.trim();
      const phone = form.phone.trim();
      const result = await registerCitizen({
        fullName: form.fullName.trim(),
        password: form.password,
        adress: form.adress.trim(),
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
      });

      if (!result.token) {
        throw new Error(
          "Registration completed but the server returned no token. Please sign in."
        );
      }

      localStorage.setItem("sst_citizen_token", result.token);
      localStorage.setItem("sst_citizen", JSON.stringify(result.citizen));
      navigate("/citizen/portal", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          requestError.message ??
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="citizen-auth-page">
      <section className="citizen-auth-card">
        <p className="citizen-auth-eyebrow">Citizen Portal</p>
        <h1>Create your account</h1>
        <p className="citizen-auth-description">
          Register to access Shaggar citizen services.
        </p>

        {error && <p className="citizen-auth-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="citizen-full-name">Full name</label>
          <input
            id="citizen-full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            maxLength={150}
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <label htmlFor="citizen-register-email">Email address</label>
          <input
            id="citizen-register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />

          <label htmlFor="citizen-phone">Phone number</label>
          <input
            id="citizen-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
          />
          <p className="citizen-auth-hint">
            Provide at least one contact method: email or phone.
          </p>

          <label htmlFor="citizen-register-address">Address</label>
          <input
            id="citizen-register-address"
            name="adress"
            type="text"
            autoComplete="street-address"
            maxLength={250}
            value={form.adress}
            onChange={handleChange}
            required
          />

          <label htmlFor="citizen-register-password">Password</label>
          <input
            id="citizen-register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={form.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="citizen-confirm-password">Confirm password</label>
          <input
            id="citizen-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="citizen-auth-switch">
          Already registered? <Link to="/citizen/login">Sign in</Link>
        </p>
        <Link className="citizen-auth-home" to="/">Return to home</Link>
      </section>
    </main>
  );
};

export default CitizenRegister;
