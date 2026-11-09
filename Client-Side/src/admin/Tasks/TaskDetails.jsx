// src/pages/Tasks/TaskDetails.jsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/TaskDetails.css";

export default function TaskDetails() {
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/api/work-tasks/${id}`);
        const data = response.data;

        setTask(data.task ?? data.data ?? data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load task details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <main className="task-details-page">
        <section className="task-details-card task-details-state">
          <p>Loading task details...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="task-details-page">
        <section className="task-details-card task-details-state">
          <h1>Task Details</h1>
          <p className="task-details-error" role="alert">{error}</p>
          <Link className="task-details-back" to="/admin/tasks">
            Back to Tasks
          </Link>
        </section>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="task-details-page">
        <section className="task-details-card task-details-state">
          <h1>Task Details</h1>
          <p>Task not found.</p>
          <Link className="task-details-back" to="/admin/tasks">
            Back to Tasks
          </Link>
        </section>
      </main>
    );
  }

  const workPlan =
    task.workPlanId?.title ??
    task.workPlan?.title ??
    "Not specified";

  const assignedStaff =
    task.assignedTo?.name ??
    task.assignedStaff?.name ??
    "Unassigned";
  const statusClass = (task.status || "pending")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");
  const priorityClass = (task.priority || "normal")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");

  return (
    <main className="task-details-page">
      <section className="task-details-card">
        <header className="task-details-header">
          <div>
            <p className="task-details-eyebrow">Task Management</p>
            <h1>Task Details</h1>
            <p className="task-details-subtitle">
              Review the task assignment, timeline, and current status.
            </p>
          </div>
          <nav className="task-details-actions" aria-label="Task actions">
            <Link
              className="task-details-back"
              to="/admin/tasks"
            >
              Back to Tasks
            </Link>
            <Link
              className="task-details-edit"
              to={`/admin/tasks/edit/${task._id}`}
            >
              Edit Task
            </Link>
          </nav>
        </header>

        <div className="task-details-summary">
          <div>
            <p className="task-details-label">Task title</p>
            <h2>{task.title}</h2>
          </div>
          <div className="task-details-badges">
            <span className={`task-badge task-status-${statusClass}`}>
              {task.status || "pending"}
            </span>
            <span className={`task-badge task-priority-${priorityClass}`}>
              {task.priority || "normal"} priority
            </span>
          </div>
        </div>

        <section className="task-details-content" aria-label="Task information">
          <div className="task-description-panel">
            <h3>Description</h3>
            <p>{task.description || "No description provided."}</p>
          </div>

          <dl className="task-details-grid">
            <div className="task-detail-item">
              <dt>Work plan</dt>
              <dd>{workPlan}</dd>
            </div>
            <div className="task-detail-item">
              <dt>Assigned staff</dt>
              <dd>{assignedStaff}</dd>
            </div>
            <div className="task-detail-item">
              <dt>Due date</dt>
              <dd>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "Not set"}
              </dd>
            </div>
            <div className="task-detail-item">
              <dt>Created</dt>
              <dd>
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleDateString()
                  : "Not available"}
              </dd>
            </div>
            <div className="task-detail-item">
              <dt>Last updated</dt>
              <dd>
                {task.updatedAt
                  ? new Date(task.updatedAt).toLocaleDateString()
                  : "Not available"}
              </dd>
            </div>
          </dl>
        </section>
      </section>
    </main>
  );
}