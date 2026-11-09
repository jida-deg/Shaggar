// src/pages/Complaints/ComplaintDetails.jsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/ComplaintDetails.css";

const complaintStatuses = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "awaiting_information",
  "approved",
  "resolved",
  "rejected",
  "closed",
];

export default function ComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("submitted");
  const [resolutionNote, setResolutionNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/api/complaints/${id}`);
        const data = response.data;

        const result =
          data.complaint ?? data.data ?? data;

        setComplaint(result);
        setStatus(result.status || "submitted");
        setResolutionNote(result.resolutionNote || result.resolution || "");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load complaint details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
  
    if (!complaintStatuses.includes(status)) {
      setError("Please select a valid complaint status.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(
        `/api/complaints/${id}/status`,
        {
          status,
          resolutionNote,
        }
      );

      const data = response.data;
      const updated =
        data.complaint ?? data.data;

      if (updated && typeof updated === "object") {
        setComplaint(updated);
        setStatus(updated.status || status);
        setResolutionNote(updated.resolutionNote || updated.resolution || "");
      } else {
        setComplaint((previous) => ({
          ...previous,
          status,
          resolutionNote,
        }));
      }

      setMessage("Complaint updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update complaint."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="complaint-details-page complaint-details-state">
        <p>Loading complaint details...</p>
      </section>
    );
  }

  if (!complaint) {
    return (
      <section className="complaint-details-page complaint-details-state">
        {error && <p role="alert">{error}</p>}
        <Link to="/admin/complaints">Back to Complaints</Link>
      </section>
    );
  }

  const citizenName =
    complaint.citizen?.name ||
    complaint.citizenId?.name ||
    complaint.citizenId?.fullName ||
    "Not available";

  const assignedStaff =
    complaint.assignedTo?.name ||
    complaint.assignedStaff?.name ||
    "Unassigned";
  const statusValue = (complaint.status || "submitted")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");

  return (
    <section className="complaint-details-page">
      <div className="page-header">
        <h2>Complaint Details</h2>

        <Link to="/admin/complaints">
          Back to Complaints
        </Link>
      </div>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <div className="complaint-details">
        <p>
          <strong>Reference Number:</strong>{" "}
          {complaint.referenceNumber ||
            complaint.complaintNumber ||
            complaint._id}
        </p>

        <p>
          <strong>Title:</strong>{" "}
          {complaint.title || "Untitled complaint"}
        </p>

        <p>
          <strong>Citizen:</strong> {citizenName}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {complaint.category || "Not specified"}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          <span>{complaint.description || "No description provided."}</span>
        </p>

        <p>
          <strong>Current Status:</strong>{" "}
          <span className="complaint-status" data-status={statusValue}>
            {(complaint.status || "submitted").replaceAll("_", " ")}
          </span>
        </p>

        <p>
          <strong>Assigned Staff:</strong> {assignedStaff}
        </p>

        <p>
          <strong>Date Submitted:</strong>{" "}
          {complaint.createdAt
            ? new Date(complaint.createdAt).toLocaleString()
            : "Not available"}
        </p>

        {complaint.updatedAt && (
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(complaint.updatedAt).toLocaleString()}
          </p>
        )}

        {(complaint.resolutionNote || complaint.resolution) && (
          <p>
            <strong>Resolution Note:</strong>{" "}
            {complaint.resolutionNote || complaint.resolution}
          </p>
        )}
      </div>

      <hr />

      <section className="complaint-update-section">
        <h3>Update Complaint</h3>

        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor="status">Status</label>

            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {complaintStatuses.map((item) => (
                <option key={item} value={item}>
                  {item.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="resolutionNote">
              Resolution or Progress Note
            </label>

            <textarea
              id="resolutionNote"
              value={resolutionNote}
              onChange={(event) =>
                setResolutionNote(event.target.value)
              }
              rows={4}
              placeholder="Describe the action taken or resolution"
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>
    </section>
  );
}