import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES, USER_ROLES } from "../../utils/constants";
import Loading from "./Loading";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectTo =
      user?.role === USER_ROLES.MENTOR ? ROUTES.DASHBOARD : ROUTES.DASHBOARD;

    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
