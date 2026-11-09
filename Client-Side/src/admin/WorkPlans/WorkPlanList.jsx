import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/CreateDirectorate.css";

const WorkPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/api/work-plans");
        const data = response.data;

        const items = Array.isArray(data)
          ? data
          : data.plans ?? data.data ?? [];

        setPlans(items);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load Plans."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const getDirectorateName = (plan) => {
    const directorate = plan.directorateId;

    if (directorate && typeof directorate === "object") {
      return directorate.name || "Directorate assigned";
    }

    return directorate ? "Directorate assigned" : "Not assigned";
  };

  const formatDate = (date) => {
    if (!date) return "Not set";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "Invalid date"
      : parsedDate.toLocaleDateString();
  };

  return (
    <main className="create-directorate-page">
      <section className="create-directorate-card">
        <header className="create-directorate-header">
          <p className="create-directorate-eyebrow">
            Directorate Management
          </p>

          <h1>Plans</h1>

          <p>
            View directorate objectives, deadlines, and progress.
          </p>
        </header>

        <p>
          <strong>Total Plans:</strong> {plans.length}
        </p>

        <div className="directorate-list-actions">
          <Link
            className="directorate-submit"
            to="/admin/work-plans/create"
          >
            + Create Plan
          </Link>
        </div>

        {loading && <p>Loading Plans...</p>}

        {error && (
          <p
            className="directorate-message directorate-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && !error && plans.length === 0 && (
          <p>No Plans have been created yet.</p>
        )}

        {!loading && !error && plans.length > 0 && (
          <div className="directorate-list">
            {plans.map((plan) => (
              <article
                className="directorate-item"
                key={plan._id}
              >
                <div>
                  <h2>{plan.title}</h2>

                  <p>
                    <strong>Directorate:</strong>{" "}
                    {getDirectorateName(plan)}
                  </p>

                  <p>
                    <strong>Start date:</strong>{" "}
                    {formatDate(plan.weekStart)}
                  </p>

                  <p>
                    <strong>End date:</strong>{" "}
                    {formatDate(plan.weekEnd)}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {plan.status || "draft"}
                  </p>

                  <p>
                    <strong>Progress:</strong>{" "}
                    {Number(plan.progress) || 0}%
                  </p>

                  <progress
                    value={Math.min(
                      100,
                      Math.max(0, Number(plan.progress) || 0)
                    )}
                    max="100"
                    aria-label={`${plan.title} progress`}
                  />
                </div>

                <div className="directorate-item-actions">
                  <Link to={`/admin/work-plans/${plan._id}`}>
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <Link
          className="directorate-back-link"
          to="/admin/dashboard"
        >
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
};

export default WorkPlanList;
