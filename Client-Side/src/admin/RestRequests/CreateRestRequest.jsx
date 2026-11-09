// src/pages/RestRequests/CreateRestRequest.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createRestRequest } from "../../API/restRequest.api";
import "../../assets/CreateRestRequest.css";

export default function CreateRestRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    requestType: "rest_day",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.endDate < form.startDate) {
      setError("The end date cannot be before the start date.");
      return;
    }

    try {
      setSaving(true);

      await createRestRequest(form);

      navigate("/admin/my-rest-requests");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit your rest-period request."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rest-request-form-page">
      <h2>Request Rest Period</h2>
      <p>Submit your requested dates and explain the reason.</p>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="requestType">Request Type</label>
          <select
            id="requestType"
            name="requestType"
            value={form.requestType}
            onChange={handleChange}
            required
          >
            <option value="rest_day">Rest day</option>
            <option value="annual_leave">Annual leave</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            min={form.startDate || undefined}
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Explain why you are requesting this rest period"
            rows={4}
            required
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Submitting..." : "Submit Request"}
        </button>

        <Link to="/admin/my-rest-requests">Cancel</Link>
      </form>
    </section>
  );
}