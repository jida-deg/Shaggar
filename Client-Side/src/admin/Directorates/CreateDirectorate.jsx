import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/CreateDirectorate.css";

const getCurrentAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("sst_admin") || "null");
  } catch {
    return null;
  }
};

const CreateDirectorate = () => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const admin = getCurrentAdmin();
    if (!admin?._id) {
      setError("Your admin session could not be read. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/directorates", {
        ...form,
        code: form.code.trim().toUpperCase(),
        managerId: admin._id,
      });

      setSuccess(response.data.message || "Directorate created successfully.");
      setForm({ name: "", code: "", description: "" });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to create directorate."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-directorate-page">
      <section className="create-directorate-card">
        <header className="create-directorate-header">
          <p className="create-directorate-eyebrow">Administration</p>
          <h1>Create Directorate</h1>
          <p>Add a directorate and assign yourself as its initial manager.</p>
        </header>

        <form className="create-directorate-form" onSubmit={handleSubmit}>
          <label className="directorate-field" htmlFor="directorate-name">
            Directorate name
            <input
              id="directorate-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Human Resources"
              maxLength={120}
              autoComplete="organization"
              required
            />
          </label>

          <label className="directorate-field" htmlFor="directorate-code">
            Directorate code
            <input
              id="directorate-code"
              name="code"
              type="text"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. HR"
              maxLength={20}
              autoComplete="off"
              required
            />
            <span>The code is saved in uppercase and must be unique.</span>
          </label>

          <label className="directorate-field" htmlFor="directorate-description">
            Description
            <textarea
              id="directorate-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the directorate's responsibilities"
              rows={5}
              maxLength={1000}
              required
            />
          </label>

          {error && (
            <p className="directorate-message directorate-error" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="directorate-message directorate-success" role="status">
              {success}
            </p>
          )}

          <button
            className="directorate-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Directorate"}
          </button>
        </form>

        <Link className="directorate-back-link" to="/admin/dashboard">
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
};

export default CreateDirectorate;
