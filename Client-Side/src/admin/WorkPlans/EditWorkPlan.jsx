import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/CreateDirectorate.css";

const EditWorkPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [directorates, setDirectorates] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    directorateId: "",
    weekStart: "",
    weekEnd: "",
    status: "draft",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [planResponse, directoratesResponse] =
          await Promise.all([
            api.get(`/api/work-plans/${id}`),
            api.get("/api/directorates"),
          ]);

        const planData = planResponse.data;
        const plan =
          planData.plan ?? planData.data ?? planData;

        const directorateData = directoratesResponse.data;
        const items = Array.isArray(directorateData)
          ? directorateData
          : directorateData.directorates ??
            directorateData.data ??
            [];

        setDirectorates(
          items.filter(
            (item) =>
              item.isActive !== false ||
              item._id ===
                (plan.directorateId?._id ??
                  plan.directorateId)
          )
        );

        setForm({
          title: plan.title || "",
          description: plan.description || "",
          directorateId:
            plan.directorateId?._id ??
            plan.directorateId ??
            "",
          weekStart: plan.weekStart
            ? new Date(plan.weekStart).toISOString().slice(0, 10)
            : "",
          weekEnd: plan.weekEnd
            ? new Date(plan.weekEnd).toISOString().slice(0, 10)
            : "",
          status: plan.status || "draft",
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load Plan information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("Plan ID is missing.");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (new Date(form.weekEnd) < new Date(form.weekStart)) {
      setError("The end date cannot be before the start date.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.put(`/api/work-plans/${id}`, {
        title: form.title.trim(),
        description: form.description.trim(),
        directorateId: form.directorateId,
        weekStart: form.weekStart,
        weekEnd: form.weekEnd,
        status: form.status,
      });

      setSuccess(
        response.data.message || "Plan updated successfully."
      );

      // Open the Plan details page after the update.
      navigate(`/admin/work-plans/${id}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to update the Plan."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="create-directorate-page">
        <section className="create-directorate-card">
          <p>Loading Plan information...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="create-directorate-page">
      <section className="create-directorate-card">
        <header className="create-directorate-header">
          <p className="create-directorate-eyebrow">
            Directorate Management
          </p>

          <h1>Edit Plan</h1>

          <p>Update the Plan's information and schedule.</p>
        </header>

        {error && (
          <p
            className="directorate-message directorate-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            className="directorate-message directorate-success"
            role="status"
          >
            {success}
          </p>
        )}

        <form
          className="create-directorate-form"
          onSubmit={handleSubmit}
        >
          <label className="directorate-field" htmlFor="edit-plan-title">
            Plan title

            <input
              id="edit-plan-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </label>

          <label
            className="directorate-field"
            htmlFor="edit-plan-description"
          >
            Description and objectives

            <textarea
              id="edit-plan-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              maxLength={3000}
              required
            />
          </label>

          <label
            className="directorate-field"
            htmlFor="edit-plan-directorate"
          >
            Directorate

            <select
              id="edit-plan-directorate"
              name="directorateId"
              value={form.directorateId}
              onChange={handleChange}
              required
            >
              <option value="">Select a directorate</option>

              {directorates.map((directorate) => (
                <option
                  key={directorate._id}
                  value={directorate._id}
                >
                  {directorate.name} ({directorate.code})
                </option>
              ))}
            </select>
          </label>

          <label
            className="directorate-field"
            htmlFor="edit-plan-start-date"
          >
            Start date

            <input
              id="edit-plan-start-date"
              name="weekStart"
              type="date"
              value={form.weekStart}
              onChange={handleChange}
              required
            />
          </label>

          <label
            className="directorate-field"
            htmlFor="edit-plan-end-date"
          >
            End date

            <input
              id="edit-plan-end-date"
              name="weekEnd"
              type="date"
              value={form.weekEnd}
              min={form.weekStart || undefined}
              onChange={handleChange}
              required
            />
          </label>

          <label
            className="directorate-field"
            htmlFor="edit-plan-status"
          >
            Plan status

            <select
              id="edit-plan-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="draft">Draft</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </label>

          <button
            className="directorate-submit"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>

        <Link
          className="directorate-back-link"
          to={`/admin/work-plans/${id}`}
        >
          Cancel and Return to Plan
        </Link>
      </section>
    </main>
  );
};

export default EditWorkPlan;
