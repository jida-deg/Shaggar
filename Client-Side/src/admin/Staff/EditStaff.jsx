import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/CreateDirectorate.css";

const EditStaff = () => {
  const { id } = useParams();

  const [directorates, setDirectorates] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "staff",
    directorateId: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [staffResponse, directoratesResponse] =
          await Promise.all([
            api.get(`/api/staff/${id}`),
            api.get("/api/directorates"),
          ]);

        const staffData = staffResponse.data;
        const member =
          staffData.staff ?? staffData.data ?? staffData;

        const directorateData = directoratesResponse.data;
        const items = Array.isArray(directorateData)
          ? directorateData
          : directorateData.directorates ??
            directorateData.data ??
            [];

        setDirectorates(
          items.filter(
            (item) =>
              item.isActive !== false ||
              item._id ===
                (member.directorateId?._id ??
                  member.directorateId)
          )
        );

        setForm({
          name: member.name || "",
          email: member.email || "",
          role: member.role || "staff",
          directorateId:
            member.directorateId?._id ??
            member.directorateId ??
            "",
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load staff information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("Staff ID is missing.");
      setLoading(false);
    }
  }, [id]);

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
      const response = await api.put(`/api/staff/${id}`, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        directorateId: form.directorateId,
      });

      const updated = response.data.message;

      setSuccess(
        updated || "Staff member updated successfully."
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to update staff member."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="create-directorate-page">
        <section className="create-directorate-card">
          <p>Loading staff information...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="create-directorate-page">
      <section className="create-directorate-card">
        <header className="create-directorate-header">
          <p className="create-directorate-eyebrow">
            Staff Management
          </p>

          <h1>Edit Staff</h1>

          <p>Update the staff member's information and assignment.</p>
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
          <label className="directorate-field" htmlFor="edit-staff-name">
            Full name
            <input
              id="edit-staff-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={120}
              required
            />
          </label>

          <label
            className="directorate-field"
            htmlFor="edit-staff-email"
          >
            Email
            <input
              id="edit-staff-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="directorate-field" htmlFor="edit-staff-role">
            Staff role
            <select
              id="edit-staff-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="staff">Staff</option>
              <option value="directorate_manager">
                Directorate Manager
              </option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label
            className="directorate-field"
            htmlFor="edit-staff-directorate"
          >
            Directorate
            <select
              id="edit-staff-directorate"
              name="directorateId"
              value={form.directorateId}
              onChange={handleChange}
              required
            >
              <option value="">Select a directorate</option>

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
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
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

export default EditStaff;
