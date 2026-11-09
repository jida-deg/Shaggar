// src/pages/ServiceRequests/ServiceRequestDetails.jsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/ServiceRequestDetails.css";

const allowedStatuses = [
  "submitted",
  "pending",
  "under_review",
  "assigned",
  "in_progress",
  "awaiting_information",
  "approved",
  "resolved",
  "rejected",
  "closed",
];

export default function ServiceRequestDetails() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [newStatus, setNewStatus] = useState("submitted");
  const [resolutionNote, setResolutionNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/api/service-requests/${id}`
        );

        const data = response.data;
        const result =
          data.serviceRequest ?? data.request ?? data.data ?? data;

        setRequest(result);
        setNewStatus(result.status || "submitted");
        setResolutionNote(result.resolutionNote || result.resolution || "");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load service request."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleStatusUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!allowedStatuses.includes(newStatus)) {
      setError("Please select a valid status.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(
        `/api/service-requests/${id}/status`,
        {
          status: newStatus,
          resolutionNote,
        }
      );

      const data = response.data;
      const updated =
        data.serviceRequest ?? data.request ?? data.data;

      if (updated && typeof updated === "object") {
        setRequest(updated);
        setNewStatus(updated.status || newStatus);
      } else {
        setRequest((previous) => ({
          ...previous,
          status: newStatus,
          resolutionNote,
        }));
      }

      setMessage("Service request updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update service request."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading service request...</p>;
  }

  if (!request) {
    return (
      <section>
        {error && <p role="alert">{error}</p>}
        <Link to="/admin/service-requests">
          Back to Service Requests
        </Link>
      </section>
    );
  }

  const citizenName =
    request.citizen?.name ||
    request.citizenId?.name ||
    request.citizenId?.fullName ||
    "Not available";

  const serviceName =
    request.serviceType ||
    request.serviceName ||
    request.title ||
    "Not specified";

  const assignedStaff =
    request.assignedTo?.name ||
    request.assignedStaff?.name ||
    "Unassigned";

  return (
    <section className="service-request-details-page">
      <div className="page-header">
        <h2>Service Request Details</h2>

        <Link to="/admin/service-requests">
          Back to Requests
        </Link>
      </div>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <div className="service-request-details">
        <p>
          <strong>Reference Number:</strong>{" "}
          {request.referenceNumber ||
            request.requestNumber ||
            request._id}
        </p>

        <p>
          <strong>Citizen:</strong> {citizenName}
        </p>

        <p>
          <strong>Service:</strong> {serviceName}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {request.description || "No description provided."}
        </p>

        <p>
          <strong>Current Status:</strong>{" "}
          {request.status || "submitted"}
        </p>

        <p>
          <strong>Assigned Staff:</strong> {assignedStaff}
        </p>

        <p>
          <strong>Submitted:</strong>{" "}
          {request.createdAt
            ? new Date(request.createdAt).toLocaleString()
            : "Not available"}
        </p>

        {request.updatedAt && (
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(request.updatedAt).toLocaleString()}
          </p>
        )}

        {(request.resolutionNote || request.resolution) && (
          <p>
            <strong>Resolution Note:</strong>{" "}
            {request.resolutionNote || request.resolution}
          </p>
        )}
      </div>

      <hr />

      <h3>Update Request Status</h3>

      <form onSubmit={handleStatusUpdate}>
        <div>
          <label htmlFor="newStatus">Status</label>

          <select
            id="newStatus"
            value={newStatus}
            onChange={(event) => setNewStatus(event.target.value)}
          >
            {allowedStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="resolutionNote">
            Resolution or Update Note
          </label>

          <textarea
            id="resolutionNote"
            value={resolutionNote}
            onChange={(event) =>
              setResolutionNote(event.target.value)
            }
            rows={4}
            placeholder="Record an update or explain the resolution"
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Status"}
        </button>
      </form>
    </section>
  );
}