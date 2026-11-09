// src/pages/RestRequests/RestRequestDetails.jsx

import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/RestRequestDetails.css";

export default function RestRequestDetails() {
  const { id } = useParams();
  const isSuperAdmin = (() => {
    try {
      const role = JSON.parse(localStorage.getItem("sst_admin") || "null")?.role;
      return String(role || "").toLowerCase().replace(/[\s_-]/g, "") === "superadmin";
    } catch {
      return false;
    }
  })();

  const [request, setRequest] = useState(null);
  const [decisionComment, setDecisionComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/rest-period-requests/${id}`);
      const data = response.data;

      setRequest(data.request ?? data.data ?? data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load request details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleDecision = async (status) => {
    const action = status === "approved" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this request?`)) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.patch(
        `/api/rest-period-requests/${id}/decision`,
        {
          status,
          decisionNote: decisionComment,
        }
      );

      const data = response.data;
      const updatedRequest = data.request ?? data.data ?? data;

      if (updatedRequest) {
        setRequest(updatedRequest);
      } else {
        await fetchRequest();
      }

      setMessage(`Request ${status} successfully.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${action} the request.`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="rest-request-details-page">
        <section className="rest-request-details-card">
          <p className="rest-request-state">Loading request details...</p>
        </section>
      </main>
    );
  }

  if (!request) {
    return (
      <main className="rest-request-details-page">
        <section className="rest-request-details-card rest-request-state">
          <p className="rest-request-eyebrow">Rest-period request</p>
          <h1>Request Details</h1>
          <p role="alert">
            {error || "This rest-period request could not be found."}
          </p>
          <Link
            className="rest-request-back"
            to={isSuperAdmin ? "/admin/rest-requests" : "/admin/my-rest-requests"}
          >
            {isSuperAdmin ? "Back to Requests" : "Back to My Requests"}
          </Link>
        </section>
      </main>
    );
  }

  const staff =
    request.employeeId?.name ||
    request.staffId?.name ||
    request.staff?.name ||
    request.requestedBy?.name ||
    "Not available";

  const manager =
    request.reviewedBy?.name ||
    request.managerId?.name ||
    "Not reviewed";
  const statusClass = (request.status || "pending")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  return (
    <main className="rest-request-details-page">
      <section className="rest-request-details-card">
        <header className="rest-request-details-header">
          <div>
            <p className="rest-request-eyebrow">Rest-period request</p>
            <h1>Request Details</h1>
            <p className="rest-request-subtitle">
              {isSuperAdmin
                ? "Review the requested dates and record a decision."
                : "View the details and status of your submitted request."}
            </p>
          </div>
          <Link
            className="rest-request-back"
            to={isSuperAdmin ? "/admin/rest-requests" : "/admin/my-rest-requests"}
          >
            {isSuperAdmin ? "Back to Requests" : "Back to My Requests"}
          </Link>
        </header>

        {error && <p className="rest-request-alert" role="alert">{error}</p>}
        {message && <p className="rest-request-success" role="status">{message}</p>}

        <div className="rest-request-summary">
          <div>
            <p className="rest-request-field-label">Request type</p>
            <h2>{(request.requestType || "rest_day").replace(/_/g, " ")}</h2>
          </div>
          <span className="request-status" data-status={statusClass}>
            {request.status || "pending"}
          </span>
        </div>

        <dl className="rest-request-details-grid">
          <div>
            <dt>Staff member</dt>
            <dd>{staff}</dd>
          </div>
          <div>
            <dt>Start date</dt>
            <dd>{formatDate(request.startDate)}</dd>
          </div>
          <div>
            <dt>End date</dt>
            <dd>{formatDate(request.endDate)}</dd>
          </div>
          <div>
            <dt>Submitted</dt>
            <dd>{formatDate(request.createdAt)}</dd>
          </div>
          <div>
            <dt>Reviewed by</dt>
            <dd>{manager}</dd>
          </div>
          <div>
            <dt>Reviewed on</dt>
            <dd>{formatDate(request.reviewedAt)}</dd>
          </div>
        </dl>

        <section className="rest-request-reason">
          <h3>Reason</h3>
          <p>{request.reason || "No reason provided."}</p>
        </section>

        {request.decisionNote && (
          <section className="rest-request-reason rest-request-decision-note">
            <h3>Decision note</h3>
            <p>{request.decisionNote}</p>
          </section>
        )}

        {isSuperAdmin && request.status === "pending" && (
          <section className="request-decision">
            <h3>Review request</h3>
            <label htmlFor="decisionComment">
              Decision note <span>(optional)</span>
            </label>
            <textarea
              id="decisionComment"
              value={decisionComment}
              onChange={(event) => setDecisionComment(event.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Add a note for the staff member"
            />
            <div className="request-decision-actions">
              <button
                className="request-approve"
                type="button"
                disabled={saving}
                onClick={() => handleDecision("approved")}
              >
                {saving ? "Processing..." : "Approve Request"}
              </button>
              <button
                className="request-reject"
                type="button"
                disabled={saving}
                onClick={() => handleDecision("rejected")}
              >
                {saving ? "Processing..." : "Reject Request"}
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}