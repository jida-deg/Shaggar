import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createCitizenServiceCase,
  getCitizenDirectorates,
  getMyServiceCases,
} from "./citizenAuth.api";
import "../assets/citizenCases.css";

const statusLabels = {
  submitted: "Submitted",
  under_review: "Under review",
  assigned: "Assigned",
  in_progress: "In progress",
  awaiting_information: "Awaiting information",
  approved: "Approved",
  resolved: "Resolved",
  rejected: "Rejected",
  closed: "Closed",
};

const unwrapData = (response) => response?.data ?? response?.directorates ?? response;

const CitizenCasePage = ({ caseType }) => {
  const isComplaint = caseType === "complaint";
  const heading = isComplaint ? "Submit a complaint" : "Request a service";
  const recordLabel = isComplaint ? "complaints" : "service requests";
  const [directorates, setDirectorates] = useState([]);
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({
    directorateId: "",
    category: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [directorateResponse, myCases] = await Promise.all([
        getCitizenDirectorates(),
        getMyServiceCases(caseType),
      ]);
      setDirectorates(unwrapData(directorateResponse));
      setCases(Array.isArray(myCases) ? myCases : myCases?.data ?? []);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("sst_citizen_token");
        localStorage.removeItem("sst_citizen");
        navigate("/citizen/login", { replace: true });
        return;
      }
      setError(
        requestError.response?.data?.message ??
          `Unable to load your ${recordLabel}. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  }, [caseType, navigate, recordLabel]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const created = await createCitizenServiceCase(caseType, form);
      setForm({ directorateId: "", category: "", title: "", description: "" });
      setMessage(
        created.referenceNumber
          ? `Your submission was received. Reference: ${created.referenceNumber}`
          : "Your submission was received."
      );
      await loadData();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          `Unable to submit your ${isComplaint ? "complaint" : "request"}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="citizen-cases-page">
      <section className="citizen-cases-shell">
        <header className="citizen-cases-header citizen-case-page-header">
          <div>
            <p className="citizen-cases-eyebrow">Citizen services</p>
            <h1>{heading}</h1>
            <p>Submissions are sent to the responsible directorate and appear in your status history.</p>
          </div>
          <Link className="citizen-case-back" to="/citizen/portal">← Citizen portal</Link>
        </header>

        {error && <p className="citizen-case-alert" role="alert">{error}</p>}
        {message && <p className="citizen-case-success" role="status">{message}</p>}

        <div className="citizen-case-layout">
          <section className="citizen-case-panel">
            <h2>Submission details</h2>
            <form className="citizen-case-form" onSubmit={handleSubmit}>
              <label htmlFor="case-directorate">Responsible directorate</label>
              <select
                id="case-directorate"
                name="directorateId"
                value={form.directorateId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a directorate</option>
                {directorates.map((directorate) => (
                  <option key={directorate._id} value={directorate._id}>
                    {directorate.name}{directorate.code ? ` (${directorate.code})` : ""}
                  </option>
                ))}
              </select>

              <label htmlFor="case-category">Category</label>
              <input
                id="case-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                maxLength={100}
                placeholder={isComplaint ? "e.g. Roads, sanitation" : "e.g. Documentation"}
                required
              />

              <label htmlFor="case-title">Title</label>
              <input
                id="case-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={200}
                required
              />

              <label htmlFor="case-description">Description</label>
              <textarea
                id="case-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                maxLength={5000}
                required
              />

              <button type="submit" disabled={submitting || directorates.length === 0}>
                {submitting ? "Submitting..." : isComplaint ? "Submit complaint" : "Submit request"}
              </button>
              {directorates.length === 0 && !loading && (
                <p className="citizen-case-hint">No active directorates are available for submissions.</p>
              )}
            </form>
          </section>

          <section className="citizen-case-panel citizen-case-history">
            <div className="citizen-case-history-heading">
              <div>
                <h2>Your {recordLabel}</h2>
                <p>Statuses are updated by the responsible administration team.</p>
              </div>
              <button type="button" onClick={loadData} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {loading ? (
              <p className="citizen-case-empty">Loading your {recordLabel}...</p>
            ) : cases.length === 0 ? (
              <p className="citizen-case-empty">You have not submitted any {recordLabel} yet.</p>
            ) : (
              <div className="citizen-case-list">
                {cases.map((item) => (
                  <article className="citizen-case-item" key={item._id}>
                    <div className="citizen-case-item-top">
                      <div>
                        <p className="citizen-case-reference">{item.referenceNumber || "Reference pending"}</p>
                        <h3>{item.title}</h3>
                      </div>
                      <span className={`citizen-case-status status-${item.status || "submitted"}`}>
                        {statusLabels[item.status] || "Submitted"}
                      </span>
                    </div>
                    <p className="citizen-case-item-meta">
                      {item.category} · {item.directorateId?.name || "Directorate"}
                    </p>
                    <p className="citizen-case-item-description">{item.description}</p>
                    <p className="citizen-case-item-meta">
                      Submitted {item.createdAt ? new Date(item.createdAt).toLocaleString() : "recently"}
                    </p>
                    {item.resolution && (
                      <p className="citizen-case-resolution"><strong>Update:</strong> {item.resolution}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default CitizenCasePage;
