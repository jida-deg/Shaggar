import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/CreateDirectorate.css";

const EditDirectorate = () => {
  const [directorates, setDirectorates] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDirectorates = async () => {
      try {
        setError("");

        const response = await api.get("/api/directorates");

        const data = response.data;
        const items = Array.isArray(data)
          ? data
          : data.directorates ?? data.data ?? [];

        setDirectorates(items);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load directorates."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorates();
  }, []);

  const handleSelect = (event) => {
    const id = event.target.value;
    setSelectedId(id);
    setError("");
    setSuccess("");

    const directorate = directorates.find(
      (item) => item._id === id
    );

    if (directorate) {
      setForm({
        name: directorate.name || "",
        code: directorate.code || "",
        description: directorate.description || "",
      });
    } else {
      setForm({
        name: "",
        code: "",
        description: "",
      });
    }
  };

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

    if (!selectedId) {
      setError("Please select a directorate to edit.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(
        `/api/directorates/${selectedId}`,
        {
          name: form.name.trim(),
          code: form.code.trim().toUpperCase(),
          description: form.description.trim(),
        }
      );

      const updatedDirectorate =
        response.data.directorate ??
        response.data.data ??
        response.data;

      setDirectorates((current) =>
        current.map((item) =>
          item._id === selectedId
            ? {
                ...item,
                ...updatedDirectorate,
                name: form.name.trim(),
                code: form.code.trim().toUpperCase(),
                description: form.description.trim(),
              }
            : item
        )
      );

      setSuccess(
        response.data.message ||
          "Directorate updated successfully."
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to update directorate."
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
            Administration
          </p>

          <h1>Edit Directorate</h1>

          <p>
            Select an existing directorate and update its information.
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

        {loading ? (
          <p>Loading directorates...</p>
        ) : (
          <>
            <div className="directorate-field">
              <label htmlFor="select-directorate">
                Select directorate
              </label>

              <select
                id="select-directorate"
                value={selectedId}
                onChange={handleSelect}
              >
                <option value="">Choose a directorate</option>

                {directorates.map((directorate) => (
                  <option
                    key={directorate._id}
                    value={directorate._id}
                  >
                    {directorate.name} ({directorate.code})
                  </option>
                ))}
              </select>
            </div>

            {selectedId && (
              <form
                className="create-directorate-form"
                onSubmit={handleSubmit}
              >
                <label
                  className="directorate-field"
                  htmlFor="edit-directorate-name"
                >
                  Directorate name

                  <input
                    id="edit-directorate-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={120}
                    required
                  />
                </label>

                <label
                  className="directorate-field"
                  htmlFor="edit-directorate-code"
                >
                  Directorate code

                  <input
                    id="edit-directorate-code"
                    name="code"
                    type="text"
                    value={form.code}
                    onChange={handleChange}
                    maxLength={20}
                    required
                  />

                  <span>
                    The code is saved in uppercase and must be unique.
                  </span>
                </label>

                <label
                  className="directorate-field"
                  htmlFor="edit-directorate-description"
                >
                  Description

                  <textarea
                    id="edit-directorate-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    maxLength={1000}
                    required
                  />
                </label>

                <button
                  className="directorate-submit"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving changes..." : "Save Changes"}
                </button>
              </form>
            )}
          </>
        )}

        <Link
          className="directorate-back-link"
          to="/admin/dashboard"
        >
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
};

export default EditDirectorate;
