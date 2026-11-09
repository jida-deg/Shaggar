import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteStaff, getStaffById } from "../../API/staff.api";
import "../../assets/CreateDirectorate.css";

const DeleteStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staffMember, setStaffMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStaffMember = async () => {
      try {
        const response = await getStaffById(id);
        setStaffMember(response.staff ?? response.data ?? response);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load staff member."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadStaffMember();
    } else {
      setError("Staff ID is missing.");
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const response = await deleteStaff(id);
      navigate("/admin/staff", {
        replace: true,
        state: {
          message:
            response.message || "Staff member deleted successfully.",
        },
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to delete staff member."
      );
      setDeleting(false);
    }
  };

  return (
    <main className="create-directorate-page">
      <section className="create-directorate-card">
        <header className="create-directorate-header">
          <p className="create-directorate-eyebrow">Staff Management</p>
          <h1>Delete Staff Member</h1>
          <p>Review the staff member before permanently deleting the record.</p>
        </header>

        {error && (
          <p className="directorate-message directorate-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading staff information...</p>
        ) : staffMember ? (
          <>
            <div className="directorate-item">
              <div>
                <h2>{staffMember.name || "Unnamed staff member"}</h2>
                <p><strong>Email:</strong> {staffMember.email || "Not provided"}</p>
                <p><strong>Role:</strong> {staffMember.role || "Not provided"}</p>
              </div>
            </div>
            {/* <p role="note">
              This action permanently deletes this staff member and cannot be
              undone.
            </p> */}
            <button
              className="directorate-submit staff-delete-button"
              type="button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Permanently Delete"}
            </button>
          </>
        ) : null}

        <Link className="directorate-back-link" to="/admin/staff">
          Cancel and return to Staff List
        </Link>
      </section>
    </main>
  );
};

export default DeleteStaff;
