// src/pages/ServiceRequests/ServiceRequestList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/AdminRequestLists.css";

export default function ServiceRequestList() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/service-requests");
        const data = response.data;

        setRequests(
          Array.isArray(data)
            ? data
            : data.serviceRequests ?? data.requests ?? data.data ?? []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load service requests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const statusMatches =
      statusFilter === "all" ||
      request.status === statusFilter;

    const searchText = search.toLowerCase();

    const searchMatches = [
      request.referenceNumber,
      request.requestNumber,
      request.serviceType,
      request.serviceName,
      request.citizen?.name,
      request.citizenId?.name,
      request.citizenId?.fullName,
      request.title,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(searchText)
      );

    return statusMatches && searchMatches;
  });

  if (loading) {
    return (
      <section className="service-request-list-page">
        <p>Loading service requests...</p>
      </section>
    );
  }

  return (
    <section className="service-request-list-page">
      <div className="page-header">
        <h2>Citizen Service Requests</h2>
      </div>

      {error && <p role="alert">{error}</p>}

      <div className="request-filters">
        <label htmlFor="searchRequests">
          Search requests
        </label>

        <input
          id="searchRequests"
          type="search"
          placeholder="Search reference, citizen, or service"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <label htmlFor="statusFilter">Filter by status</label>

        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="submitted">Submitted</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="awaiting_information">Awaiting Information</option>
          <option value="approved">Approved</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <p>No matching service requests found.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Citizen</th>
                <th>Service</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Assigned Staff</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>
                    {request.referenceNumber ||
                      request.requestNumber ||
                      request._id}
                  </td>

                  <td>
                    {request.citizen?.name ||
                      request.citizenId?.name ||
                      request.citizenId?.fullName ||
                      "Not available"}
                  </td>

                  <td>
                    {request.serviceType ||
                      request.serviceName ||
                      request.title ||
                      "Not specified"}
                  </td>

                  <td>
                    {request.createdAt
                      ? new Date(
                          request.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <span
                      className="request-status"
                      data-status={(request.status || "submitted").toLowerCase().replaceAll("_", "-")}
                    >
                      {request.status || "submitted"}
                    </span>
                  </td>

                  <td>
                    {request.assignedTo?.name ||
                      request.assignedStaff?.name ||
                      "Unassigned"}
                  </td>

                  <td>
                    <Link
                      to={`/admin/service-requests/${request._id}`}
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
    </section>
  );
}
