import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/DirectorateDetails.css";

const DirectorateDetail = () => {
  const { id } = useParams();
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

  const [directorate, setDirectorate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDirectorate = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/api/directorates/${id}`);
        const data = response.data;
        setDirectorate(data.directorate ?? data.data ?? data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load directorate details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorate();
  }, [id]);

  if (loading) {
    return (
      <main className="directorate-detail-page">
        <p className="directorate-detail-state" role="status">
          Loading directorate details...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="directorate-detail-page">
        <section className="directorate-detail-state directorate-detail-error">
          <p role="alert">{error}</p>
          <Link to="/admin/directorates">Back to Directorates</Link>
        </section>
      </main>
    );
  }

  if (!directorate) {
    return (
      <main className="directorate-detail-page">
        <p className="directorate-detail-state">Directorate not found.</p>
      </main>
    );
  }

  const manager =
    directorate.managerId?.name ||
    directorate.manager?.name ||
    "Not assigned";

  return (
    <div className="directorate-detail">
      <div className="directorate-detail-header">
        <h1>Directorate Details</h1>

        <div>
          <Link to="/admin/directorates">Back</Link>{" "}
          {isSuperAdmin && (
            <Link to={`/admin/directorates/edit/${directorate._id}`}>
              Edit Directorate
            </Link>
          )}
        </div>
      </div>

      <div className="directorate-detail-card">
        <h2>{directorate.name}</h2>

        <p>
          <strong>Code:</strong> {directorate.code}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {directorate.description ??
            directorate.discription ??
            "No description provided"}
        </p>

        <p>
          <strong>Manager:</strong> {manager}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {directorate.isActive ? "Active" : "Inactive"}
        </p>

        <p>
          <strong>Created:</strong>{" "}
          {directorate.createdAt
            ? new Date(directorate.createdAt).toLocaleDateString()
            : "Not available"}
        </p>

        <p>
          <strong>Last Updated:</strong>{" "}
          {directorate.updatedAt
            ? new Date(directorate.updatedAt).toLocaleDateString()
            : "Not available"}
        </p>
      </div>
    </div>
  );
};

export default DirectorateDetail;
