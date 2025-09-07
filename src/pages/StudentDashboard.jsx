import { useDashboard } from "../hooks/useDashboard";
import Loading from "../components/common/Loading";
import WeeklySessionsView from "../components/dashboard/WeeklySessionsView";

export default function StudentDashboard() {
  const {
    dashboardData,
    loading,
    error,
    registerForSession,
    unregisterFromSession,
  } = useDashboard();

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        This Week&apos;s Sessions
      </h1>

      <WeeklySessionsView
        sessionsData={dashboardData.thisWeek}
        myRegistrations={dashboardData.myRegistrations}
        onRegister={registerForSession}
        onUnregister={unregisterFromSession}
      />
    </div>
  );
}
