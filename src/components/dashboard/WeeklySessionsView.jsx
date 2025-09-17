import SessionCard from "./SessionCard";

export default function WeeklySessionsView({
  sessionsData,
  myRegistrations = [],
  onRegister,
  onUnregister,
  onEditSession,
}) {
  const { inProgress = [], upcoming = [], past = [], pastSessions = [] } = sessionsData || {};

  const renderSessions = (title, sessions, statusType) => (
    <div className="mb-10">
      <div className="mb-6">
        <h2 className="section-title">{title}</h2>
        <div className="section-underline"></div>
      </div>

      {sessions?.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <p className="text-gray-500">No {title.toLowerCase()} this week</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions?.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              statusType={statusType}
              isRegistered={myRegistrations?.includes(session._id)}
              onRegister={() => onRegister(session._id)}
              onUnregister={() => onUnregister(session._id)}
              onEditSession={onEditSession}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {renderSessions("In Progress", inProgress, "inProgress")}
      {renderSessions("Upcoming", upcoming, "upcoming")}
      {renderSessions("Past Sessions", past || pastSessions, "past")}
    </div>
  );
}
