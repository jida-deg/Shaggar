import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCitizenProfile } from "./citizenAuth.api";
import "../assets/citizenAuth.css";

const CitizenProfile = () => {
  const navigate = useNavigate();
  const [citizen, setCitizen] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setError("");
    try {
      const profile = await getCitizenProfile();
      setCitizen(profile.citizen ?? profile.data ?? profile);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("sst_citizen_token");
        localStorage.removeItem("sst_citizen");
        navigate("/citizen/login", { replace: true });
        return;
      }
      setError(
        requestError.response?.data?.message ??
          "Unable to load your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = () => {
    localStorage.removeItem("sst_citizen_token");
    localStorage.removeItem("sst_citizen");
    navigate("/citizen/login", { replace: true });
  };

  if (loading) {
    return (
      <main className="citizen-auth-page">
        <section className="citizen-auth-card citizen-profile-card">
          <p>Loading your profile...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="citizen-auth-page">
      <section className="citizen-auth-card citizen-profile-card">
        <header className="citizen-profile-header">
          <div>
            <p className="citizen-auth-eyebrow">Citizen Portal</p>
            <h1>My profile</h1>
            <p className="citizen-auth-description">
              Your citizen account information.
            </p>
          </div>
          <button
            className="citizen-logout-button"
            type="button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </header>

        {error && (
          <div className="citizen-auth-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadProfile}>
              Try again
            </button>
          </div>
        )}

        {citizen && (
          <dl className="citizen-profile-fields">
            <div>
              <dt>Full name</dt>
              <dd>{citizen.fullName || "Not provided"}</dd>
            </div>
            <div>
              <dt>Email address</dt>
              <dd>{citizen.email || "Not provided"}</dd>
            </div>
            <div>
              <dt>Phone number</dt>
              <dd>{citizen.phone || "Not provided"}</dd>
            </div>
            <div>
              <dt>Account status</dt>
              <dd>{citizen.isActive === false ? "Inactive" : "Active"}</dd>
            </div>
            <div>
              <dt>Verification</dt>
              <dd>{citizen.isVerified ? "Verified" : "Not verified"}</dd>
            </div>
            {citizen.createdAt && (
              <div>
                <dt>Member since</dt>
                <dd>{new Date(citizen.createdAt).toLocaleDateString()}</dd>
              </div>
            )}
          </dl>
        )}

        <Link className="citizen-auth-home" to="/citizen/portal">Return to citizen portal</Link>
      </section>
    </main>
  );
};

export default CitizenProfile;
