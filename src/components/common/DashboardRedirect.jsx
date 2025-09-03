import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";
import Loading from "./Loading";

export default function DashboardRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Navigate to={ROUTES.DASHBOARD} replace />;
}
