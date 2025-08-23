import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES, USER_ROLES } from "../../utils/constants";
import Loading from "./Loading";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const redirectTo =
      user?.role === USER_ROLES.MENTOR
        ? ROUTES.MENTOR_DASHBOARD
        : ROUTES.STUDENT_DASHBOARD;

    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
