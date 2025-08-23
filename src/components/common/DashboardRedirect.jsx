import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES, USER_ROLES } from "../../utils/constants";
import Loading from "./Loading";

export default function DashboardRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const dashboardRoute =
    user?.role === USER_ROLES.MENTOR
      ? ROUTES.MENTOR_DASHBOARD
      : ROUTES.STUDENT_DASHBOARD;

  return <Navigate to={dashboardRoute} replace />;
}
