import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog.jsx";

const primaryLinks = [
 { label: "Dashboard", to: "/admin/dashboard", icon: "⌂" },
  { label: "Directorates", to: "/admin/directorates", icon: "▥" },
  { label: "Staff", to: "/admin/staff", icon: "♟" },
  { label: "Work Plans", to: "/admin/work-plans", icon: "▣" },
  { label: "Tasks", to: "/admin/tasks", icon: "✓" },
  { label: "Rest Requests", to: "/admin/rest-requests", icon: "▦" },
  { label: "Citizens", to: "/admin/citizens", icon: "♧" },
  { label: "Service Requests", to: "/admin/service-requests", icon: "▤" },
  { label: "Complaints", to: "/admin/complaints", icon: "▧" },
  { label: "Events", to: "/admin/events", icon: "▦" },
  { label: "Reports", to: "/admin/dashboard", icon: "▤" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [eventMenuOpen, setEventMenuOpen] = useState(true);
  const [adminMenuOpen, setAdminMenuOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);
 
  const isActive = (to) =>
    location.pathname === to || (to !== "/admin/dashboard" && location.pathname.startsWith(`${to}/`));

  const logout = () => {
    localStorage.removeItem("sst_token");
    localStorage.removeItem("sst_admin");
    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      <aside className="admin-sidebar">
        <Link to="/admin/dashboard" className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48"><path d="M24 4 6 12v12c0 11 7 17 18 21 11-4 18-10 18-21V12L24 4Z" /><path d="M15 34V20h18v14M12 17l12-7 12 7M21 20v14m6-14v14M11 37h26" /></svg>
          </span>
          <span className="brand-name">Shaggar City<small>Science and Technology<br />(SST)</small></span>
        </Link>

        <nav className="sidebar-navigation" aria-label="Admin navigation">
          {primaryLinks.map((item) => (
            <Link
              to={item.to}
              key={item.label}
              className={`sidebar-link${isActive(item.to) ? " is-active" : ""}`}
              aria-current={isActive(item.to) ? "page" : undefined}
            >
              <span className="sidebar-link__icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          

          <div className="sidebar-group">
            <button className="sidebar-group__toggle" type="button" onClick={() => setEventMenuOpen((open) => !open)} aria-expanded={eventMenuOpen}>
              <span><span className="sidebar-link__icon" aria-hidden="true">▦</span>Event Management</span>
              <span className={`sidebar-chevron${eventMenuOpen ? " is-open" : ""}`} aria-hidden="true">⌄</span>
            </button>
            {eventMenuOpen && (
              <div className="sidebar-submenu">
                <Link to="/admin/events/create">Create Event</Link>
                <Link to="/admin/events">Manage Events</Link>
                <Link to="/events">View Public Events</Link>
              </div>
            )}
          </div>

          <div className="sidebar-group">
            <button className="sidebar-group__toggle" type="button" onClick={() => setAdminMenuOpen((open) => !open)} aria-expanded={adminMenuOpen}>
              <span><span className="sidebar-link__icon" aria-hidden="true">♟</span>Admin Management</span>
              <span className={`sidebar-chevron${adminMenuOpen ? " is-open" : ""}`} aria-hidden="true">⌄</span>
            </button>
            {adminMenuOpen && (
              <div className="sidebar-submenu">
                <Link to="/admin/admins/create">Add Admin</Link>
                <Link to="/admin/admins">Manage Admins</Link>
              </div>
            )}
          </div>

          <div className="sidebar-group">
            <button className="sidebar-group__toggle" type="button" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen}>
              <span><span className="sidebar-link__icon" aria-hidden="true">⚙</span>Settings</span>
              <span className={`sidebar-chevron${settingsOpen ? " is-open" : ""}`} aria-hidden="true">⌄</span>
            </button>
            {settingsOpen && <div className="sidebar-submenu"><Link to="/admin/change-password">Change Password</Link></div>}
          </div>
          <button className="sidebar-link sidebar-logout" type="button" onClick={() => setConfirmLogout(true)}>
            <span className="sidebar-link__icon" aria-hidden="true">⇥</span>
            <span>Logout</span>
          </button>
        </nav>
        <div className="sidebar-footer">Shaggar City Science and Technology</div>
      </aside>
      <ConfirmDialog
        open={confirmLogout}
        title="Sign out?"
        message="You will need to sign in again to access the admin dashboard."
        confirmLabel="Sign out"
        onConfirm={logout}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  );
};

export default Sidebar;
