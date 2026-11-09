// src/pages/Citizens/CitizenList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/Cititzens.css";

export default function CitizenList() {
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/citizens");
        const data = response.data;

        setCitizens(
          Array.isArray(data)
            ? data
            : data.citizens ?? data.data ?? []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load citizen accounts."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCitizens();
  }, []);

  const filteredCitizens = citizens.filter((citizen) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch = [
      citizen.name,
      citizen.fullName,
      citizen.email,
      citizen.phone,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(searchText)
      );

    const isActive = citizen.isActive ?? citizen.active ?? true;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && isActive) ||
      (statusFilter === "inactive" && !isActive);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <p>Loading citizens...</p>;
  }

  return (
    <section className="citizen-list-page">
      <div className="page-header">
        <h2>Citizen Management</h2>
      </div>

      {error && <p role="alert">{error}</p>}

      <div className="citizen-filters">
        <div>
          <label htmlFor="citizenSearch">Search citizens</label>
          <input
            id="citizenSearch"
            type="search"
            placeholder="Search by name, email, or phone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="citizenStatus">Account status</label>
          <select
            id="citizenStatus"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="all">All accounts</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <p>
        Total displayed: {filteredCitizens.length}
      </p>

      {filteredCitizens.length === 0 ? (
        <p>No matching citizens found.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Account Status</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCitizens.map((citizen) => {
                const active =
                  citizen.isActive ?? citizen.active ?? true;

                return (
                  <tr key={citizen._id}>
                    <td>
                      {citizen.name ||
                        citizen.fullName ||
                        "Not provided"}
                    </td>

                    <td>{citizen.email || "Not provided"}</td>

                    <td>{citizen.phone || "Not provided"}</td>

                    <td>{active ? "Active" : "Inactive"}</td>

                    <td>
                      {citizen.createdAt
                        ? new Date(
                            citizen.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <Link
                        to={`/admin/citizens/${citizen._id}`}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
