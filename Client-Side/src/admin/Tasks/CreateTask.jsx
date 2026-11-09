import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const getItems = (data, ...keys) => {
  if (Array.isArray(data)) return data;
  return keys.map((key) => data[key]).find(Array.isArray) ?? data.data ?? [];
};

export default function CreateTask() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [workPlans, setWorkPlans] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkPlans = async () => {
      try {
        const [plansResponse, staffResponse] = await Promise.all([
          api.get("/api/work-plans"),
          api.get("/api/staff"),
        ]);

        setWorkPlans(
          getItems(plansResponse.data, "workPlans", "plans")
        );
        setStaff(
          getItems(staffResponse.data, "staff", "data").filter(
            (member) => member.isActive !== false
          )
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load work plans."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkPlans();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "workPlanId" ? { assignedTo: "" } : {}),
    }));
  };

  const selectedPlan = workPlans.find(
    (plan) => plan._id === form.workPlanId
  );
  const selectedDirectorateId =
    selectedPlan?.directorateId?._id ??
    selectedPlan?.directorateId;
  const availableStaff = staff.filter(
    (member) =>
      (member.directorateId?._id ?? member.directorateId) ===
      selectedDirectorateId
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!selectedPlan || !selectedDirectorateId) {
      setError("Select a work plan with an assigned directorate.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/api/work-tasks", {
        ...form,
        directorateId:
          selectedPlan.directorateId._id ??
          selectedPlan.directorateId,
      });
      navigate("/admin/tasks");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create task."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="task-form-page">
      <div className="page-header">
        <h2>Create Task</h2>
        <Link to="/admin/tasks">Back to Tasks</Link>
      </div>

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
            disabled={loading || workPlans.length === 0}
            required
          >
            <option value="">
              {loading ? "Loading work plans..." : "Select a Work Plan"}
            </option>
            {workPlans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.title}
              </option>
            ))}
          </select>
          {!loading && workPlans.length === 0 && !error && (
            <p>Create a work plan before adding a task.</p>
          )}
        </div>

        <div>
          <label htmlFor="assignedTo">Assigned Staff</label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            disabled={loading || availableStaff.length === 0}
            required
          >
            <option value="">
              {loading
                ? "Loading staff..."
                : "Select Staff from this Directorate"}
            </option>
            {availableStaff.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
          {!loading && selectedPlan && availableStaff.length === 0 && (
            <p>
              No active staff are assigned to this work plan&apos;s
              directorate.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
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

        <button
          type="submit"
          disabled={
            saving ||
            loading ||
            workPlans.length === 0 ||
            availableStaff.length === 0
          }
        >
          {saving ? "Creating..." : "Create Task"}
        </button>
        <Link to="/admin/tasks">Cancel</Link>
      </form>
    </section>
  );
}