import { useAuth } from "../../context/AuthContext";
import StudentDashboard from "../../pages/StudentDashboard";
import MentorDashboard from "../../pages/MentorDashboard";
import Loading from "./Loading";

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // Рендерим компонент в зависимости от роли пользователя
  return user?.role === "mentor" ? <MentorDashboard /> : <StudentDashboard />;
}
