// src/pages/RestRequests/MyRestRequests.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/MyRestRequests.css";

export default function MyRestRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const response = await api.get("/api/rest-period-requests/my");
        const data = response.data;

        setRequests(
          Array.isArray(data)
            ? data
            : data.requests ?? data.data ?? []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load your requests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  if (loading) {
    return (
      <main className="my-rest-requests-page">
        <p>Loading your requests...</p>
      </main>
    );
  }

  return (
    <main className="my-rest-requests-page">
      <div className="page-header">
        <div>
          <p className="my-rest-requests-eyebrow">Requests</p>
          <h2>My Rest Requests</h2>
          <p className="my-rest-requests-subtitle">
            Track your submitted rest-period requests and their status.
          </p>
        </div>
        <Link className="my-rest-requests-new" to="/admin/rest-requests/create">
          + New Request
        </Link>
      </div>

      {error && <p role="alert">{error}</p>}

      {requests.length === 0 ? (
        <p>You have not submitted any rest-period requests.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>
                    {request.startDate
                      ? new Date(request.startDate).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    {request.endDate
                      ? new Date(request.endDate).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>{request.reason}</td>
                  <td>
                    <span
                      className="request-status"
                      data-status={(request.status || "pending")
                        .toLowerCase()
                        .replace(/_/g, "-")}
                    >
                      {request.status || "pending"}
                    </span>
                  </td>

                  <td>
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <Link
                      to={`/admin/rest-requests/${request._id}`}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}