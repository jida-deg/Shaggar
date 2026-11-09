// src/pages/Complaints/ComplaintList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/AdminRequestLists.css";

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/complaints");
        const data = response.data;

        setComplaints(
          Array.isArray(data)
            ? data
            : data.complaints ?? data.data ?? []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const statusMatches =
      statusFilter === "all" ||
      complaint.status === statusFilter;

    const searchText = search.toLowerCase();

    const searchableFields = [
      complaint.referenceNumber,
      complaint.complaintNumber,
      complaint.title,
      complaint.category,
      complaint.citizen?.name,
      complaint.citizenId?.name,
      complaint.citizenId?.fullName,
    ];

    const searchMatches = searchableFields
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(searchText)
      );

    return statusMatches && searchMatches;
  });

  if (loading) {
    return (
      <section className="complaint-list-page">
        <p>Loading complaints...</p>
      </section>
    );
  }

  return (
    <section className="complaint-list-page">
      <div className="page-header">
        <h2>Citizen Complaints</h2>
      </div>

      {error && <p role="alert">{error}</p>}

      <div className="complaint-filters">
        <label htmlFor="complaintSearch">
          Search complaints
        </label>

        <input
          id="complaintSearch"
          type="search"
          placeholder="Search by reference, title, or citizen"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <label htmlFor="complaintStatus">Filter by status</label>

        <select
          id="complaintStatus"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="all">All statuses</option>
          <option value="submitted">Submitted</option>
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

      {filteredComplaints.length === 0 ? (
        <p>No matching complaints found.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Title</th>
                <th>Citizen</th>
                <th>Category</th>
                <th>Date Submitted</th>
                <th>Status</th>
                <th>Assigned Staff</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>
                    {complaint.referenceNumber ||
                      complaint.complaintNumber ||
                      complaint._id}
                  </td>

                  <td>{complaint.title || "Untitled complaint"}</td>

                  <td>
                    {complaint.citizen?.name ||
                      complaint.citizenId?.name ||
                      complaint.citizenId?.fullName ||
                      "Not available"}
                  </td>

                  <td>{complaint.category || "Not specified"}</td>

                  <td>
                    {complaint.createdAt
                      ? new Date(
                          complaint.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <span
                      className="request-status"
                      data-status={(complaint.status || "submitted").toLowerCase().replaceAll("_", "-")}
                    >
                      {complaint.status || "submitted"}
                    </span>
                  </td>

                  <td>
                    {complaint.assignedTo?.name ||
                      complaint.assignedStaff?.name ||
                      "Unassigned"}
                  </td>

                  <td>
                    <Link
                      to={`/admin/complaints/${complaint._id}`}
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