import { Navigate } from "react-router-dom";

const CitizenProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("sst_citizen_token");

  if (!token) {
    return <Navigate to="/citizen/login" replace />;
  }

  return children;
};

export default CitizenProtectedRoute;
