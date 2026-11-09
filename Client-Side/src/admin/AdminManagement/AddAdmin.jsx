import { useState } from "react";
import axios from "axios";
import "../../assets/AddAdmin.css";
import { Link } from "react-router-dom";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("sst_token");

      const res = await axios.post(
        "http://localhost:3000/api/admin/register-superadmin",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Admin created successfully!");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      console.log(res.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to create admin."
      );
    }
  };

  return (
    <div className="add-admin-page">

      <div className="add-admin-card">

        <div className="add-admin-header">
          <h1 className="add-admin-title">Add New Admin</h1>
          <p className="add-admin-subtitle">
            Create a new administrator account.
          </p>
        </div>

        <form
          className="add-admin-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="create-admin-btn"
            type="submit"
          >
            Create Admin
          </button>

         <Link to="/admin/dashboard">
        <button className="back-dashboard-btn">
          Back to Dashboard
        </button>
      </Link>
       

        </form>

        

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}

      </div>
      
    
      
      
    </div>
  );
};

export default AddAdmin;