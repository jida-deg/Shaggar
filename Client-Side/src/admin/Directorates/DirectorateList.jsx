import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDirectorates } from "../../API/directorate.api";
import "../../assets/DirectorateList.css";

const DirectorateList = () => {
  const isSuperAdmin = (() => {
    try {
      const role = JSON.parse(
        localStorage.getItem("sst_admin") || "null"
      )?.role;
      return String(role || "")
        .toLowerCase()
        .replace(/[\s_-]/g, "") === "superadmin";
    } catch {
      return false;
    }
  })();
  const [directorates, setDirectorates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDirectorates = async () => {
      try {
        const data = await getAllDirectorates();
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

  return (
    <main className="create-directorate-page">
      <section className="create-directorate-card">
        <header className="create-directorate-header">
          <p className="create-directorate-eyebrow">
            Administration
          </p>

          <h1>Directorate List</h1>

          <p>
            View and manage the city's directorates.
          </p>
        </header>

        {isSuperAdmin && (
          <div className="directorate-list-actions">
            <Link
              className="directorate-submit"
              to="/admin/directorates/create"
            >
              + Create Directorate
            </Link>
          </div>
        )}

        {loading && <p>Loading directorates...</p>}

        {error && (
          <p
            className="directorate-message directorate-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && !error && directorates.length === 0 && (
          <p>No directorates have been created yet.</p>
        )}

        {!loading && directorates.length > 0 && (
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

                  <p>
                    <strong>Status:</strong>{" "}
                    {directorate.isActive ? "Active" : "Inactive"}
                  </p>
                </div>

                <div className="directorate-item-actions">
                  <Link
                    to={`/admin/directorates/${directorate._id}`}
                  >
                    View Details
                  </Link>

                  {isSuperAdmin && (
                    <>
                      <Link
                        to={`/admin/directorates/edit/${directorate._id}`}
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/admin/directorates/delete/${directorate._id}`}
                      >
                        Delete
                      </Link>
                    </>
                  )}
                </div>
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

export default DirectorateList;
