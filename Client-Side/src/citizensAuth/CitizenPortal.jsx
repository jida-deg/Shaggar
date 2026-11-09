import { Link, useNavigate } from "react-router-dom";
import "../assets/citizenCases.css";

const CitizenPortal = () => {
  const navigate = useNavigate();
  let citizen = {};
  try {
    citizen = JSON.parse(localStorage.getItem("sst_citizen") || "{}");
  } catch {
    citizen = {};
  }

  const handleLogout = () => {
    localStorage.removeItem("sst_citizen_token");
    localStorage.removeItem("sst_citizen");
    navigate("/citizen/login", { replace: true });
  };

  return (
    <main className="citizen-cases-page">
      <section className="citizen-cases-shell">
        <header className="citizen-cases-header">
          <div>
            <p className="citizen-cases-eyebrow">Citizen services</p>
            <h1>Welcome{citizen.fullName ? `, ${citizen.fullName}` : ""}</h1>
            <p>Submit requests and follow their progress in one place.</p>
          </div>
          <div className="citizen-cases-header-actions">
            <Link to="/citizen/profile">My profile</Link>
            <button type="button" onClick={handleLogout}>Sign out</button>
          </div>
        </header>

        <div className="citizen-portal-cards">
          <Link className="citizen-portal-card" to="/citizen/complaints">
            <span className="citizen-portal-icon" aria-hidden="true">!</span>
            <h2>Complaints</h2>
            <p>Report a concern and track its review and resolution.</p>
            <span className="citizen-portal-action">Submit or track complaint →</span>
          </Link>
          <Link className="citizen-portal-card" to="/citizen/service-requests">
            <span className="citizen-portal-icon" aria-hidden="true">↗</span>
            <h2>Service requests</h2>
            <p>Ask a government directorate for a service and track your request.</p>
            <span className="citizen-portal-action">Submit or track request →</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default CitizenPortal;
