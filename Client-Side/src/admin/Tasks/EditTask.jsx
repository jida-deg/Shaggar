// src/pages/Tasks/EditTask.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/CreateTask.css";

const initialForm = {
  title: "",
  description: "",
  workPlanId: "",
  assignedTo: "",
  dueDate: "",
  priority: "normal",
  status: "pending",
};

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [workPlans, setWorkPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [taskResponse, plansResponse] = await Promise.all([
          api.get(`/api/work-tasks/${id}`),
          api.get("/api/work-plans"),
        ]);

        const taskData = taskResponse.data;
        const task =
          taskData.task ?? taskData.data ?? taskData;

        const plansData = plansResponse.data;
        const plans = Array.isArray(plansData)
          ? plansData
          : plansData.workPlans ??
            plansData.plans ??
            plansData.data ??
            [];

        setWorkPlans(plans);

        setForm({
          title: task.title ?? "",
          description: task.description ?? "",
          workPlanId:
            task.workPlanId?._id ??
            task.workPlanId ??
            task.workPlan?._id ??
            "",
          assignedTo:
            task.assignedTo?._id ??
            task.assignedTo ??
            task.assignedStaff?._id ??
            "",
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().slice(0, 10)
            : "",
          priority: task.priority ?? "normal",
          status: task.status ?? "pending",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load task details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSaving(true);

      await api.put(`/api/work-tasks/${id}`, form);

      navigate(`/admin/tasks/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update task."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="task-form-page">
        <p className="task-form-loading" role="status">
          Loading task...
        </p>
      </section>
    );
  }

  return (
    <section className="task-form-page">
      <header className="page-header">
        <h2>Edit Task</h2>
        <Link to="/admin/tasks">Back to Tasks</Link>
      </header>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Task Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="workPlanId">Work Plan</label>
          <select
            id="workPlanId"
            name="workPlanId"
            value={form.workPlanId}
            onChange={handleChange}
            required
          >
            <option value="">Select a Work Plan</option>
            {workPlans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assignedTo">Assigned Staff ID</label>
          <input
            id="assignedTo"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            placeholder="Enter staff ID, if required"
          />
        </div>

        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <Link to={`/admin/tasks/${id}`}>Cancel</Link>
      </form>
    </section>
  );
}