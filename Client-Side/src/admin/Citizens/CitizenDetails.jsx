// src/pages/Citizens/CitizenDetails.jsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/Cititzens.css";
export default function CitizenDetails() {
  const { id } = useParams();

  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCitizen = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/api/citizens/${id}`);
        const data = response.data;

        setCitizen(data.citizen ?? data.data ?? data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load citizen details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCitizen();
  }, [id]);

  if (loading) {
    return <p>Loading citizen details...</p>;
  }

  if (error || !citizen) {
    return (
      <section>
        <h2>Citizen Details</h2>
        <p role="alert">
          {error || "Citizen not found."}
        </p>
        <Link to="/admin/citizens">Back to Citizens</Link>
      </section>
    );
  }

  const name =
    citizen.name || citizen.fullName || "Not provided";

  const active =
    citizen.isActive ?? citizen.active ?? true;

  const serviceRequests =
    citizen.serviceRequests ?? [];

  const complaints = citizen.complaints ?? [];

  return (
    <section className="citizen-details-page">
      <div className="page-header">
        <h2>Citizen Details</h2>

        <Link to="/admin/citizens">
          Back to Citizens
        </Link>
      </div>

      <div className="citizen-profile">
        <h3>{name}</h3>

        <p>
          <strong>Account Status:</strong>{" "}
          {active ? "Active" : "Inactive"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {citizen.email || "Not provided"}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {citizen.phone || "Not provided"}
        </p>

        {citizen.address && (
          <p>
            <strong>Address:</strong> {citizen.address}
          </p>
        )}

        {citizen.createdAt && (
          <p>
            <strong>Registered:</strong>{" "}
            {new Date(citizen.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <hr />

      <div className="citizen-activity">
        <h3>Service Requests</h3>

        {serviceRequests.length === 0 ? (
          <p>No service requests are included in this response.</p>
        ) : (
          <ul>
            {serviceRequests.map((request) => {
              const requestId =
                typeof request === "string"
                  ? request
                  : request._id;

              const reference =
                typeof request === "string"
                  ? request
                  : request.referenceNumber ||
                    request.title ||
                    request._id;

              return (
                <li key={requestId}>
                  <Link
                    to={`/admin/service-requests/${requestId}`}
                  >
                    {reference}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <h3>Complaints</h3>

        {complaints.length === 0 ? (
          <p>No complaints are included in this response.</p>
        ) : (
          <ul>
            {complaints.map((complaint) => {
              const complaintId =
                typeof complaint === "string"
                  ? complaint
                  : complaint._id;

              const reference =
                typeof complaint === "string"
                  ? complaint
                  : complaint.referenceNumber ||
                    complaint.title ||
                    complaint._id;

              return (
                <li key={complaintId}>
                  <Link
                    to={`/admin/complaints/${complaintId}`}
                  >
                    {reference}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
