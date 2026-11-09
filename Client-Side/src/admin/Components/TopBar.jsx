import { useState } from "react";

const TopBar = () => {
  const [search, setSearch] = useState("");
  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem("sst_admin") || "null");
    } catch {
      return null;
    }
  })();
  const name = admin?.name || admin?.fullName || admin?.email?.split("@")[0] || "Administrator";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <header className="admin-topbar">
      {/* <label className="topbar-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.4" /><path d="m16 16 4.3 4.3" /></svg>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search anything..."
          aria-label="Search anything"
        />
      </label> */}
      <div className="topbar-account">
        <button className="topbar-icon-button" type="button" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
          <i className="notification-dot" />
        </button>
        <span className="account-avatar" aria-hidden="true">{initials}</span>
        <div className="account-copy">
          <strong>{name}</strong>
          <span>{admin?.role === "superadmin" ? "Super Admin" : "Administrator"}</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
