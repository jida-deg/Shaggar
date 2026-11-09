// src/pages/Tasks/TaskList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/TaskList.css";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/work-tasks");
      const data = response.data;

      setTasks(
        Array.isArray(data)
          ? data
          : data.tasks ?? data.data ?? []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await api.delete(`/api/work-tasks/${id}`);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete task."
      );
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <section className="task-list-page">
      <div className="page-header">
        <h2>Tasks</h2>
        <Link to="/admin/tasks/create">Create Task</Link>
      </div>

      {error && <p role="alert">{error}</p>}

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Work Plan</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>
                    {task.workPlanId?.title ||
                      task.workPlan?.title ||
                      "Not specified"}
                  </td>
                  <td>
                    {task.assignedTo?.name ||
                      task.assignedStaff?.name ||
                      "Unassigned"}
                  </td>
                  <td>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>{task.status || "pending"}</td>
                  <td>
                    <Link to={`/admin/tasks/${task._id}`}>
                      View
                    </Link>{" "}
                    |{" "}
                    <Link to={`/admin/tasks/edit/${task._id}`}>
                      Edit
                    </Link>{" "}
                    |{" "}
                    <button
                      type="button"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
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