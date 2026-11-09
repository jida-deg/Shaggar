import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../API/axios";
import { createStaff } from "../../API/staff.api";
import "../../assets/CreateDirectorate.css";

const AddStaff = () => {
  const navigate = useNavigate();

  const [directorates, setDirectorates] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    directorateId: "",
  });

  const [loadingDirectorates, setLoadingDirectorates] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDirectorates = async () => {
      try {
        const response = await api.get("/api/directorates");
        const data = response.data;

        const items = Array.isArray(data)
          ? data
          : data.directorates ?? data.data ?? [];

        setDirectorates(
          items.filter((item) => item.isActive !== false)
        );
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load directorates."
        );
      } finally {
        setLoadingDirectorates(false);
      }
    };

    fetchDirectorates();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await createStaff({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      });

      setSuccess(
        response.data.message || "Staff member created successfully."
      );

      // Navigate to the staff list after a successful creation.
      navigate("/admin/staff", {
        state: {
          message:
            response.data.message ||
            "Staff member created successfully.",
        },
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to create staff member."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="create-directorate-page">
      <section className="create-directorate-card">
        <header className="create-directorate-header">
          <p className="create-directorate-eyebrow">
            Staff Management
          </p>

          <h1>Add Staff</h1>

          <p>
            Create a staff account and assign its role and directorate.
          </p>
        </header>

        {error && (
          <p
            className="directorate-message directorate-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            className="directorate-message directorate-success"
            role="status"
          >
            {success}
          </p>
        )}

        <form
          className="create-directorate-form"
          onSubmit={handleSubmit}
        >
          <label className="directorate-field" htmlFor="staff-name">
            Full name
            <input
              id="staff-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              maxLength={120}
              required
            />
          </label>

          <label className="directorate-field" htmlFor="staff-email">
            Email
            <input
              id="staff-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label
            className="directorate-field"
            htmlFor="staff-password"
          >
            Temporary password
            <input
              id="staff-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
            {/* <span>
              Use your backend's password policy. Never store plain-text
              passwords in MongoDB.
            </span> */}
          </label>

          <label className="directorate-field" htmlFor="staff-role">
            Staff role
            <select
              id="staff-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="staff">Staff</option>
              <option value="manager">
                Directorate Manager
              </option>
              <option value="admin">Admin</option>
            </select>
            {/* <span>
              These role values must match your backend's allowed roles.
            </span> */}
          </label>

          <label
            className="directorate-field"
            htmlFor="staff-directorate"
          >
            Directorate
            <select
              id="staff-directorate"
              name="directorateId"
              value={form.directorateId}
              onChange={handleChange}
              required
              disabled={
                loadingDirectorates || directorates.length === 0
              }
            >
              <option value="">
                {loadingDirectorates
                  ? "Loading directorates..."
                  : "Select a directorate"}
              </option>

              {directorates.map((directorate) => (
                <option
                  key={directorate._id}
                  value={directorate._id}
                >
                  {directorate.name} ({directorate.code})
                </option>
              ))}
            </select>
          </label>

          <button
            className="directorate-submit"
            type="submit"
            disabled={
              saving ||
              loadingDirectorates ||
              directorates.length === 0
            }
          >
            {saving ? "Creating..." : "Create Staff"}
          </button>
        </form>
        
        <Link
          className="directorate-back-link"
          to="/admin/staff"
        >
          Back to Staff List
        </Link>
      </section>
    </main>
  );
};

export default AddStaff;
