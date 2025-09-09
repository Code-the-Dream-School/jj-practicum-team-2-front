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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      {/* Header Section - using shared styles */}
      <div className="app-header">
        <div className="app-header__avatar">
          <span className="text-4xl">📅</span>
        </div>

        <div className="app-header__content">
          <h1 className="app-header__title">This Week&apos;s Sessions</h1>
          <p className="app-header__description">
            Manage your learning schedule and join upcoming sessions
          </p>
        </div>
      </div>

      {/* Sessions Content */}
      <div className="w-full max-w-4xl mt-6">
        <WeeklySessionsView
          sessionsData={dashboardData.thisWeek}
          myRegistrations={dashboardData.myRegistrations}
          onRegister={registerForSession}
          onUnregister={unregisterFromSession}
        />
      </div>
    </div>
  );
}
