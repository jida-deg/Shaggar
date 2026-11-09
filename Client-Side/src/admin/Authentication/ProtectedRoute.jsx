import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
  const token = localStorage.getItem("sst_token");
  const storedAdmin = localStorage.getItem("sst_admin");

  let role = "";
  if (storedAdmin) {
    try {
      role = String(JSON.parse(storedAdmin)?.role || "")
        .toLowerCase()
        .replace(/[\s_-]/g, "");
    } catch {
      role = "";
    }
  }
  const isSuperAdmin = role === "superadmin";

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;