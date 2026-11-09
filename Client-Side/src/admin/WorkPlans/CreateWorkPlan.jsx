import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/CreateDirectorate.css";

const CreateWorkPlan = () => {
  const navigate = useNavigate();

  const [directorates, setDirectorates] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    directorateId: "",
    weekStart: "",
    weekEnd: "",
  });

  const [loadingDirectorates, setLoadingDirectorates] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDirectorates = async () => {
      try {
        const response = await api.get("/api/directorates");
        const data = response.data;

        const items = Array.isArray(data)
          ? data
          : data.directorates ?? data.data ?? [];

        setDirectorates(
          items.filter((item) => item.isActive !== false)
        );
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load directorates."
        );
      } finally {
        setLoadingDirectorates(false);
      }
    };

    fetchDirectorates();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      new Date(form.weekEnd) < new Date(form.weekStart)
    ) {
      setError("The end date cannot be before the start date.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/api/work-plans", {
        title: form.title.trim(),
        description: form.description.trim(),
        directorateId: form.directorateId,
        weekStart: form.weekStart,
        weekEnd: form.weekEnd,
      });

      navigate("/admin/work-plans");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to create the Plan."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="create-directorate-page">
      <section className="create-directorate-card">
        <header className="create-directorate-header">
          <p className="create-directorate-eyebrow">
            Directorate Management
          </p>

          <h1>Create Plan</h1>

          <p>
            Define a directorate's objectives and planned activities.
          </p>
        </header>

        {error && (
          <p
            className="directorate-message directorate-error"
            role="alert"
          >
            {error}
          </p>
        )}

        <form
          className="create-directorate-form"
          onSubmit={handleSubmit}
        >
          <label className="directorate-field" htmlFor="plan-title">
            Plan title

            <input
              id="plan-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Digital Service Improvement"
              maxLength={150}
              required
            />
          </label>

          <label
            className="directorate-field"
            htmlFor="plan-description"
          >
            Description and objectives

            <textarea
              id="plan-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the objectives and expected results"
              rows={5}
              maxLength={3000}
              required
            />
          </label>

          <label
            className="directorate-field"
            htmlFor="plan-directorate"
          >
            Directorate

            <select
              id="plan-directorate"
              name="directorateId"
              value={form.directorateId}
              onChange={handleChange}
              disabled={
                loadingDirectorates || directorates.length === 0
              }
              required
            >
              <option value="">
                {loadingDirectorates
                  ? "Loading directorates..."
                  : "Select a directorate"}
              </option>

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
            htmlFor="plan-week-start"
          >
            Start date

            <input
              id="plan-week-start"
              name="weekStart"
              type="date"
              value={form.weekStart}
              onChange={handleChange}
              required
            />
          </label>

          <label
            className="directorate-field"
            htmlFor="plan-week-end"
          >
            End date

            <input
              id="plan-week-end"
              name="weekEnd"
              type="date"
              value={form.weekEnd}
              min={form.weekStart || undefined}
              onChange={handleChange}
              required
            />
          </label>

          <button
            className="directorate-submit"
            type="submit"
            disabled={
              saving ||
              loadingDirectorates ||
              directorates.length === 0
            }
          >
            {saving ? "Creating..." : "Create Plan"}
          </button>
        </form>

        <Link
          className="directorate-back-link"
          to="/admin/work-plans"
        >
          Back to Plans
        </Link>
      </section>
    </main>
  );
};

export default CreateWorkPlan;
