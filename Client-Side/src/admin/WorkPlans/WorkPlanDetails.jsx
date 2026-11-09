import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/WorkPlanDetails.css";

const WorkPlanDetails = () => {
  const { id } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError("");
      setPlan(null);

      try {
        const response = await api.get(`/api/work-plans/${id}`);
        const data = response.data;

        setPlan(data.plan ?? data.data ?? data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load Plan details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlan();
    } else {
      setError("Plan ID is missing.");
      setLoading(false);
    }
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Not set";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "Invalid date"
      : parsedDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <main className="work-plan-details-page">
        <section className="work-plan-details-card work-plan-details-state">
          <p role="status">Loading plan details...</p>
        </section>
      </main>
    );
  }

  if (error || !plan) {
    return (
      <main className="work-plan-details-page">
        <section className="work-plan-details-card work-plan-details-state">
          <p className="work-plan-details-eyebrow">Work Plan Management</p>
          <h1>Plan Details</h1>

          <p
            className="work-plan-details-error"
            role="alert"
          >
            {error || "Plan not found."}
          </p>

          <Link className="work-plan-details-back" to="/admin/work-plans">
            Back to Plans
          </Link>
        </section>
      </main>
    );
  }

  const directorate = plan.directorateId;
  const directorateName =
    directorate && typeof directorate === "object"
      ? directorate.name || "Directorate assigned"
      : directorate
        ? "Directorate assigned"
        : "Not assigned";

  const progress = Math.min(
    100,
    Math.max(0, Number(plan.progress) || 0)
  );

  return (
    <main className="work-plan-details-page">
      <section className="work-plan-details-card">
        <header className="work-plan-details-header">
          <div>
            <p className="work-plan-details-eyebrow">
              Work Plan Management
            </p>
            <h1>{plan.title}</h1>
            <p>Review the plan objectives, timeline, and progress.</p>
          </div>
          <span className="work-plan-status">
            {plan.status || "draft"}
          </span>
        </header>

        <dl className="work-plan-details-grid">
          <div className="work-plan-detail-item">
            <dt>Plan title</dt>
            <dd>{plan.title}</dd>
          </div>
          <div className="work-plan-detail-item">
            <dt>Directorate</dt>
            <dd>{directorateName}</dd>
          </div>
          <div className="work-plan-detail-item work-plan-detail-description">
            <dt>Description</dt>
            <dd>{plan.description || "No description provided."}</dd>
          </div>
          <div className="work-plan-detail-item">
            <dt>Start date</dt>
            <dd>{formatDate(plan.weekStart)}</dd>
          </div>
          <div className="work-plan-detail-item">
            <dt>End date</dt>
            <dd>{formatDate(plan.weekEnd)}</dd>
          </div>
          {plan.createdAt && (
            <div className="work-plan-detail-item">
              <dt>Created</dt>
              <dd>{formatDate(plan.createdAt)}</dd>
            </div>
          )}
          {plan.updatedAt && (
            <div className="work-plan-detail-item">
              <dt>Last updated</dt>
              <dd>{formatDate(plan.updatedAt)}</dd>
            </div>
          )}
        </dl>

        <section className="work-plan-progress" aria-label="Plan progress">
          <div>
            <h2>Progress</h2>
            <span>{progress}%</span>
          </div>
          <progress value={progress} max="100" aria-label="Plan progress" />
        </section>

        <nav className="work-plan-details-actions" aria-label="Plan actions">
          <Link className="work-plan-edit" to={`/admin/work-plans/edit/${id}`}>
            Edit Plan
          </Link>
          <Link className="work-plan-back" to="/admin/work-plans">
            Back to Plans
          </Link>
          <Link className="work-plan-dashboard" to="/admin/dashboard">
            Back to Dashboard
          </Link>
        </nav>
      </section>
    </main>
  );
};

export default WorkPlanDetails;
