import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllStaff } from "../../API/staff.api";
import "../../assets/CreateDirectorate.css";

const StaffList = () => {
  const location = useLocation();
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
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getAllStaff();

        const items = Array.isArray(data)
          ? data
          : data.staff ?? data.data ?? [];

        setStaff(items);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load staff members."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const getDirectorateName = (staffMember) => {
    const directorate = staffMember.directorateId;

    if (directorate && typeof directorate === "object") {
      return directorate.name || "Directorate assigned";
    }

    return directorate
      ? "Directorate assigned"
      : "Not assigned";
  };

  return (
    <main className="create-directorate-page">
      <section className="create-directorate-card">
        <header className="create-directorate-header">
          <p className="create-directorate-eyebrow">
            Staff Management
          </p>

          <h1>Staff List</h1>

          <p>View staff members and their assignments.</p>
        </header>

        {location.state?.message && (
          <p
            className="directorate-message directorate-success"
            role="status"
          >
            {location.state.message}
          </p>
        )}

        <p>
          <strong>Total staff:</strong> {staff.length}
        </p>

        {isSuperAdmin && (
          <div className="directorate-list-actions">
            <Link
              className="directorate-submit"
              to="/admin/staff/add"
            >
              + Add Staff
            </Link>
          </div>
        )}

        {loading && <p>Loading staff members...</p>}

        {error && (
          <p
            className="directorate-message directorate-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && !error && staff.length === 0 && (
          <p>No staff members found.</p>
        )}

        {!loading && !error && staff.length > 0 && (
          <div className="directorate-list">
            {staff.map((member) => (
              <article
                className="directorate-item"
                key={member._id}
              >
                <div>
                  <h2>{member.name}</h2>

                  <p>
                    <strong>Email:</strong> {member.email}
                  </p>

                  <p>
                    <strong>Role:</strong> {member.role}
                  </p>

                  <p>
                    <strong>Directorate:</strong>{" "}
                    {getDirectorateName(member)}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {member.isActive === false
                      ? "Inactive"
                      : "Active"}
                  </p>
                </div>

                {isSuperAdmin && (
                  <div className="directorate-item-actions">
                    <Link to={`/admin/staff/edit/${member._id}`}>
                      Edit
                    </Link>
                    <Link to={`/admin/staff/delete/${member._id}`}>
                      Delete
                    </Link>
                  </div>
                )}
                
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

export default StaffList;
