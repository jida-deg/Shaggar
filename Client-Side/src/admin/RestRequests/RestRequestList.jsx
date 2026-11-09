// src/pages/RestRequests/RestRequestList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/AdminRequestLists.css";

export default function RestRequestList() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/rest-requests");
        const data = response.data;

        setRequests(
          Array.isArray(data)
            ? data
            : data.requests ?? data.data ?? []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load rest-period requests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter(
          (request) => request.status === statusFilter
        );

  if (loading) {
    return (
      <section className="rest-request-list-page">
        <p>Loading rest-period requests...</p>
      </section>
    );
  }

  return (
    <section className="rest-request-list-page">
      <div className="page-header">
        <h2>Staff Rest Requests</h2>

        <label>
          Filter by status{" "}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>

      {error && <p role="alert">{error}</p>}

      {filteredRequests.length === 0 ? (
        <p>No requests found for this status.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>
                    {request.staffId?.name ||
                      request.staff?.name ||
                      request.requestedBy?.name ||
                      "Staff member"}
                  </td>

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
                      data-status={(request.status || "pending").toLowerCase().replaceAll("_", "-")}
                    >
                      {request.status || "pending"}
                    </span>
                  </td>

                  <td>
                    <Link
                      to={`/admin/rest-requests/${request._id}`}
                    >
                      Review Request
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}