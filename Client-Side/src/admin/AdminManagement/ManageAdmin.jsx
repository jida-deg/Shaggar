import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../assets/ManageAdmin.css";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);

  const token = localStorage.getItem("sst_token");
  const storedAdmin = localStorage.getItem("sst_admin");

  let isSuperAdmin = false;
  if (storedAdmin) {
    try {
      isSuperAdmin = JSON.parse(storedAdmin)?.role === "superadmin";
    } catch (error) {
      isSuperAdmin = false;
    }
  }

  if (!isSuperAdmin) {
    return (
      <div className="access-denied">
        <div className="access-card">
          <h2>Access Denied</h2>
          <p>This page is available to Super Admins only.</p>
        </div>
      </div>
    );
  }

  const loadAdmins = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:3000/api/admin/admins",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdmins(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/admin/admins/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadAdmins();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="manage-admin-page">

      <div className="manage-admin-header">
        <div>
          <h1 className="page-title">Manage Admins</h1>
          <p className="page-subtitle">
            View and manage system administrators
          </p>
        </div>

        <Link
          to="/admin/admins/create"
          className="add-admin-btn"
        >
          + Add New Admin
        </Link>
      </div>

      <div className="admin-table-card">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="action-column">Action</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(admins) &&
              admins.map((admin) => (
                <tr key={admin._id}>

                  <td className="admin-name">
                    {admin.name}
                  </td>

                  <td className="admin-email">
                    {admin.email}
                  </td>

                  <td>
                    <span
                      className={`role-badge ${
                        admin.role === "superadmin"
                          ? "super-admin"
                          : "admin"
                      }`}
                    >
                      {admin.role}
                    </span>
                  </td>

                  <td className="action-column">
                    {admin.role !== "superadmin" && (
                      <button
                        className="delete-btn"
                        onClick={() => deleteAdmin(admin._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>

                </tr>
              ))}
          </tbody>

        </table>
        

      </div>
       <Link to="/admin/dashboard">
          <button className="back-dashboard-btn">
            Back to Dashboard
          </button>
       </Link>


    </div>
  );
};

export default ManageAdmins;