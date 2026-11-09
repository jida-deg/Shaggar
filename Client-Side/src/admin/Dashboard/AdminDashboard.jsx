import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../API/axios";
import "../../assets/AdminDashboard.css";
import cityLogo from "../../assets/images/sheggerLogo.jpg";

const navigationGroups = [
  {
    title: "Directorate Management",
    icon: "▥",
    links: [
      { label: "Create Directorate", to: "/admin/directorates/create" },
      { label: " Directorates List", to: "/admin/directorates" },
    ],
  },
  {
    title: "Staff and Operations",
    icon: "♟",
    links: [
      { label: "Manage Staff", to: "/admin/staff" },
      { label: "Add Staff", to: "/admin/staff/add" },
      { label: "Work Plans", to: "/admin/work-plans" },
      { label: "Tasks", to: "/admin/tasks" },
      { label: "Review Rest Requests", to: "/admin/rest-requests" },
      { label: "My Rest Requests", to: "/admin/my-rest-requests" },
      { label: "Submit Rest Request", to: "/admin/rest-requests/create" },
    ],
  },
  {
    title: "Citizen Services",
    icon: "▤",
    links: [
      { label: "Service Requests", to: "/admin/service-requests" },
      { label: "Complaints", to: "/admin/complaints" },
      { label: "Citizens", to: "/admin/citizens" },
    ],
  },
  {
    title: "Event Management",
    icon: "▦",
    links: [
      { label: "Create Event", to: "/admin/events/create" },
      { label: "Manage Events", to: "/admin/events" },
    ],
  },
  {
    title: "Admin Management",
    icon: "♙",
    links: [
      { label: "Create Admin", to: "/admin/admins/create" },
      { label: "Manage Admins", to: "/admin/admins" },
    ],
  },
];

const quickActions = [
  { label: "Create Work Plan", to: "/admin/work-plans/create", icon: "▦" },
  { label: "Add Staff Member", to: "/admin/staff/add", icon: "♟" },
  { label: "Create a Task", to: "/admin/tasks/create", icon: "✓" },
  { label: "View Service Requests", to: "/admin/service-requests", icon: "▤" },
  { label: "Review Complaints", to: "/admin/complaints", icon: "⚑" },
  { label: "Submit Rest Request", to: "/admin/rest-requests/create", icon: "◷" },
];

const dashboardSections = [
  { title: "Total Staff", key: "staff", caption: "Staff members", icon: "♟", tone: "blue" },
  { title: "Directorates", key: "directorates", caption: "Active directorates", icon: "▥", tone: "green" },
  { title: "Active Work Plans", key: "workPlans", caption: "Draft and published plans", icon: "▦", tone: "purple" },
  { title: "Pending Requests", key: "pendingRequests", caption: "Open cases and rest requests", icon: "▤", tone: "orange" },
];

const adminAllowedLinks = new Set([
  "/admin/directorates",
  "/admin/staff",
  "/admin/work-plans",
  "/admin/work-plans/create",
  "/admin/my-rest-requests",
  "/admin/rest-requests/create",
  "/admin/events/create",
  "/admin/events",
]);

function getAdmin() {
  try {
    return JSON.parse(localStorage.getItem("sst_admin") || "null");
  } catch {
    return null;
  }
}

function getVisibleNavigationGroups(isSuperAdmin) {
  return navigationGroups
    .map((group) => ({
      ...group,
      links: isSuperAdmin
        ? group.links
        : group.links.filter((item) => adminAllowedLinks.has(item.to)),
    }))
    .filter((group) => group.links.length > 0);
}

function EmptyState({ children = "Not found yet" }) {
  return <p className="dashboard-empty-state">{children}</p>;
}

function formatLabel(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDashboardDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openNavigationGroup, setOpenNavigationGroup] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const admin = getAdmin();
  const normalizedRole = String(admin?.role || "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");
  const isSuperAdmin = normalizedRole === "superadmin";
  const visibleNavigationGroups = getVisibleNavigationGroups(isSuperAdmin);
  const name =
    admin?.name ||
    admin?.fullName ||
    admin?.email?.split("@")[0] ||
    "Administrator";
  const role = isSuperAdmin ? "Super Admin" : "Administrator";
  const toggleNavigationGroup = (title) => {
    setOpenNavigationGroup((currentGroup) =>
      currentGroup === title ? null : title
    );
  };
  const loadDashboardData = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError("");
    try {
      const response = await api.get("/api/dashboard/summary");
      setDashboardData(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("sst_token");
        localStorage.removeItem("sst_admin");
        navigate("/admin/login", { replace: true });
        return;
      }
      setDashboardError(
        error.response?.data?.message ||
          "Unable to load dashboard data. Check that the server is running and try again."
      );
    } finally {
      setDashboardLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const logout = () => {
    localStorage.removeItem("sst_token");
    localStorage.removeItem("sst_admin");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-dashboard">
      {sidebarOpen && (
        <button
          className="dashboard-sidebar-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`dashboard-sidebar${sidebarOpen ? " is-open" : ""}`}
        aria-label="Admin navigation"
      >
        <Link
          className="dashboard-brand"
          to="/admin/dashboard"
          onClick={() => setSidebarOpen(false)}
        >
          <img src={cityLogo} alt="" />
          <span>
            Shaggar City
            <small>Science and Technology (SST)</small>
          </span>
        </Link>

        <nav className="dashboard-navigation">
          <Link
            className={`dashboard-nav-link${location.pathname === "/admin/dashboard" ? " is-active" : ""}`}
            to="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="dashboard-nav-icon" aria-hidden="true">⌂</span>
            Dashboard
          </Link>

          {visibleNavigationGroups.map((group) => (
            <section className="dashboard-nav-group" key={group.title}>
              <h2>
                <button
                  className="dashboard-nav-group-toggle"
                  type="button"
                  aria-expanded={openNavigationGroup === group.title}
                  aria-controls={`dashboard-nav-${group.title.replace(/\W+/g, "-").toLowerCase()}`}
                  onClick={() => toggleNavigationGroup(group.title)}
                >
                  <span className="dashboard-nav-group-title">
                    <span className="dashboard-nav-icon" aria-hidden="true">
                      {group.icon}
                    </span>
                    {group.title}
                  </span>
                  <span className="dashboard-nav-chevron" aria-hidden="true">
                    {openNavigationGroup === group.title ? "⌄" : "›"}
                  </span>
                </button>
              </h2>
              {openNavigationGroup === group.title && (
                <ul id={`dashboard-nav-${group.title.replace(/\W+/g, "-").toLowerCase()}`}>
                  {group.links.map((item) => {
                    const active =
                      location.pathname === item.to ||
                      location.pathname.startsWith(`${item.to}/`);

                    return (
                      <li key={item.to}>
                        <Link
                          className={active ? "is-active" : ""}
                          to={item.to}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}

          <section className="dashboard-nav-group">
            <h2>
              <button
                className="dashboard-nav-group-toggle"
                type="button"
                aria-expanded={openNavigationGroup === "Settings"}
                aria-controls="dashboard-nav-settings"
                onClick={() => toggleNavigationGroup("Settings")}
              >
                <span className="dashboard-nav-group-title">
                  <span className="dashboard-nav-icon" aria-hidden="true">⚙</span>
                  Settings
                </span>
                <span className="dashboard-nav-chevron" aria-hidden="true">
                  {openNavigationGroup === "Settings" ? "⌄" : "›"}
                </span>
              </button>
            </h2>
            {openNavigationGroup === "Settings" && (
              <ul id="dashboard-nav-settings">
                <li>
                  <Link
                    to="/admin/change-password"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Change Password
                  </Link>
                </li>
              </ul>
            )}
          </section>

          <button className="dashboard-logout" type="button" onClick={logout}>
            <span className="dashboard-nav-icon" aria-hidden="true">⇥</span>
            Logout
          </button>
        </nav>
        <p className="dashboard-sidebar-footer">
          Shaggar City Science and Technology
        </p>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="dashboard-menu-toggle"
            type="button"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          {/* <label className="dashboard-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Search anything..." />
          </label> */}
          <div className="dashboard-account">
            <span className="dashboard-account-avatar" aria-hidden="true">
              {name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0].toUpperCase())
                .join("")}
            </span>
            <span className="dashboard-account-copy">
              <strong>{name}</strong>
              <small>{role}</small>
            </span>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="dashboard-welcome">
            <span className="dashboard-welcome-icon" aria-hidden="true">▥</span>
            <div>
              <h1>Welcome back, {name}!</h1>
              <p>
                Here&apos;s what&apos;s happening in Shaggar City Science and
                Technology.
              </p>
            </div>
            <p className="dashboard-current-date">{today}</p>
          </section>

          {dashboardError && (
            <div className="dashboard-data-error" role="alert">
              <span>{dashboardError}</span>
              <button type="button" onClick={loadDashboardData}>
                Retry
              </button>
            </div>
          )}

          <section className="dashboard-stat-grid" aria-label="Overview">
            {dashboardSections.map((section) => (
              <article
                className={`dashboard-stat-card is-${section.tone}`}
                key={section.title}
              >
                <span className="dashboard-stat-icon" aria-hidden="true">
                  {section.icon}
                </span>
                <div>
                  <h2>{section.title}</h2>
                  <p>
                    {dashboardLoading
                      ? "…"
                      : dashboardError
                        ? "—"
                        : (dashboardData?.stats?.[section.key] ?? 0).toLocaleString()}
                  </p>
                  <small>{section.caption}</small>
                </div>
              </article>
            ))}
          </section>

          <div className="dashboard-columns">
            <div className="dashboard-primary-column">
              <div className="dashboard-analytics-grid">
                <section className="dashboard-panel dashboard-chart-panel">
                  <div className="dashboard-panel-heading">
                    <h2>Service Requests &amp; Complaints</h2>
                    <span className="dashboard-data-note">
                      {dashboardData
                        ? `${(dashboardData.caseTypes || []).reduce((total, item) => total + item.count, 0)} total`
                        : "Overview"}
                    </span>
                  </div>
                  {dashboardLoading ? (
                    <EmptyState>Loading case summary…</EmptyState>
                  ) : dashboardError ? (
                    <EmptyState>Case summary unavailable.</EmptyState>
                  ) : dashboardData?.caseTypes?.length ? (
                    <div className="dashboard-case-type-list">
                      {dashboardData.caseTypes.map((item) => (
                        <div className="dashboard-case-type" key={item._id}>
                          <span>{formatLabel(item._id)}</span>
                          <strong>{item.count.toLocaleString()}</strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState>No service requests or complaints yet.</EmptyState>
                  )}
                </section>
                <section className="dashboard-panel dashboard-status-panel">
                  <div className="dashboard-panel-heading">
                    <h2>Cases by Status</h2>
                  </div>
                  {dashboardLoading ? (
                    <EmptyState>Loading case statuses…</EmptyState>
                  ) : dashboardError ? (
                    <EmptyState>Case status summary unavailable.</EmptyState>
                  ) : dashboardData?.casesByStatus?.length ? (
                    <div className="dashboard-status-list">
                      {dashboardData.casesByStatus.map((item) => {
                        const total = dashboardData.casesByStatus.reduce(
                          (sum, status) => sum + status.count,
                          0
                        );
                        const percentage = total
                          ? Math.round((item.count / total) * 100)
                          : 0;
                        return (
                          <div className="dashboard-status-item" key={item._id}>
                            <div>
                              <span>{formatLabel(item._id)}</span>
                              <strong>{item.count}</strong>
                            </div>
                            <span className="dashboard-status-track">
                              <span style={{ width: `${percentage}%` }} />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState>No cases to report yet.</EmptyState>
                  )}
                </section>
              </div>

              <div className="dashboard-activity-grid">
                <section className="dashboard-panel">
                  <div className="dashboard-panel-heading">
                    <h2>Recent Activities</h2>
                  </div>
                  {dashboardLoading ? (
                    <EmptyState>Loading activity…</EmptyState>
                  ) : dashboardError ? (
                    <EmptyState>Recent activity unavailable.</EmptyState>
                  ) : dashboardData?.recentActivities?.length ? (
                    <ul className="dashboard-feed-list">
                      {dashboardData.recentActivities.map((activity) => (
                        <li key={activity._id}>
                          <span className="dashboard-feed-marker" />
                          <span className="dashboard-feed-copy">
                            <strong>{formatLabel(activity.action)}</strong>
                            <small>
                              {activity.targetModel
                                ? formatLabel(activity.targetModel)
                                : "System activity"}
                              {" · "}
                              {formatDashboardDate(activity.createdAt)}
                            </small>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState>No recorded activity yet.</EmptyState>
                  )}
                </section>

                <section className="dashboard-panel">
                  <div className="dashboard-panel-heading">
                    <h2>Recent Requests</h2>
                    {isSuperAdmin && (
                      <Link to="/admin/service-requests">View all</Link>
                    )}
                  </div>
                  {!isSuperAdmin ? (
                    <EmptyState>
                      Request details are available to Super Admins.
                    </EmptyState>
                  ) : dashboardLoading ? (
                    <EmptyState>Loading recent requests…</EmptyState>
                  ) : dashboardError ? (
                    <EmptyState>Recent requests unavailable.</EmptyState>
                  ) : dashboardData?.recentRequests?.length ? (
                    <ul className="dashboard-feed-list dashboard-request-list">
                      {dashboardData.recentRequests.map((request) => (
                        <li key={request._id}>
                          <span className="dashboard-feed-marker" />
                          <Link
                            className="dashboard-feed-copy"
                            to={
                              request.caseType === "complaint"
                                ? `/admin/complaints/${request._id}`
                                : `/admin/service-requests/${request._id}`
                            }
                          >
                            <strong>{request.title}</strong>
                            <small>
                              {request.referenceNumber}
                              {" · "}
                              {formatLabel(request.status)}
                              {" · "}
                              {formatDashboardDate(request.createdAt)}
                            </small>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState>No recent service requests or complaints.</EmptyState>
                  )}
                </section>
              </div>

              <section className="dashboard-panel dashboard-events-panel">
                <div className="dashboard-panel-heading">
                  <h2>Upcoming Events</h2>
                  <Link to="/admin/events">View all</Link>
                </div>
                {dashboardLoading ? (
                <EmptyState>Loading upcoming events…</EmptyState>
                ) : dashboardError ? (
                <EmptyState>Upcoming events unavailable.</EmptyState>
                ) : dashboardData?.upcomingEvents?.length ? (
                <ul className="dashboard-feed-list dashboard-event-list">
                  {dashboardData.upcomingEvents.map((event) => (
                    <li key={event._id}>
                      <span className="dashboard-event-date">
                        {formatDashboardDate(event.eventDate)}
                      </span>
                      <Link
                        className="dashboard-feed-copy"
                        to="/admin/events"
                      >
                        <strong>{event.title}</strong>
                        <small>{formatDashboardDate(event.eventDate)}</small>
                      </Link>
                    </li>
                  ))}
                </ul>
                ) : (
                <EmptyState>No upcoming events scheduled.</EmptyState>
                )}
              </section>
            </div>

            <aside className="dashboard-secondary-column">
              <section className="dashboard-panel dashboard-quick-actions">
                <div className="dashboard-panel-heading">
                  <h2>Quick Actions</h2>
                </div>
                <div className="dashboard-action-list">
                  {quickActions
                    .filter(
                      (action) =>
                        isSuperAdmin || adminAllowedLinks.has(action.to)
                    )
                    .map((action) => (
                      <Link to={action.to} key={action.label}>
                        <span className="dashboard-action-icon" aria-hidden="true">
                          {action.icon}
                        </span>
                        <span>{action.label}</span>
                        <span className="dashboard-action-arrow" aria-hidden="true">
                          ›
                        </span>
                      </Link>
                    ))}
                </div>
              </section>

              {/* <section className="dashboard-panel dashboard-announcements">
                <div className="dashboard-panel-heading">
                  <h2>Latest Announcements</h2>
                </div>
                <EmptyState>
                  Announcements are not available yet.
                </EmptyState>
              </section> */}
            </aside>
          </div>

          <footer className="dashboard-footer">
            <span>Shaggar City Science and Technology (SST)</span>
            <span>Innovation · Technology · A Better Tomorrow</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
