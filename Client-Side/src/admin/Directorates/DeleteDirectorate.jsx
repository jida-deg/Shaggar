import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/CreateDirectorate.css";

const DeleteDirectorate = () => {
  const [directorates, setDirectorates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDirectorates = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/directorates");

      // Supports either an array or { directorates: [...] }.
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

  useEffect(() => {
    fetchDirectorates();
  }, []);

  const handleDelete = async (directorate) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${directorate.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(directorate._id);
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(
        `/api/directorates/${directorate._id}/deactivate`
      );

      setDirectorates((current) =>
        current.filter((item) => item._id !== directorate._id)
      );

      setSuccess(
        response.data.message || "Directorate deactivated successfully."
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to delete directorate."
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="create-directorate-page">
      <section className="create-directorate-card">
        <header className="create-directorate-header">
          <p className="create-directorate-eyebrow">
            Administration
          </p>

          <h1>Deactivate Directorate</h1>

          <p>
            Review existing directorates and select the one you want
            to deactivate.
          </p>
        </header>

        {error && (
          <p className="directorate-message directorate-error" role="alert">
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
        ) : directorates.length === 0 ? (
          <p>No directorates found.</p>
        ) : (
          <div className="directorate-list">
            {directorates.map((directorate) => (
              <article
                className="directorate-item"
                key={directorate._id}
              >
                <div>
                  <h2>{directorate.name}</h2>

                  <p>
                    <strong>Code:</strong> {directorate.code}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {directorate.description || "No description"}
                  </p>
                </div>

                <button
                  type="button"
                  className="directorate-delete-button"
                  onClick={() => handleDelete(directorate)}
                  disabled={deletingId !== ""}
                >
                  {deletingId === directorate._id
                    ? "Deactivating..."
                    : "Deactivate"}
                </button>
              </article>
            ))}
          </div>
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

export default DeleteDirectorate;
