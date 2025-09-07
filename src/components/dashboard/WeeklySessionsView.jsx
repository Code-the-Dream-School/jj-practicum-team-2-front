import SessionCard from "./SessionCard";

export default function WeeklySessionsView({
  sessionsData,
  myRegistrations,
  onRegister,
  onUnregister,
}) {
  const { inProgress, upcoming, past } = sessionsData;

  const renderSessions = (title, sessions, statusType) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {title} ({sessions.length})
      </h2>

      {sessions.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              statusType={statusType}
              isRegistered={myRegistrations.includes(session._id)}
              onRegister={() => onRegister(session._id)}
              onUnregister={() => onUnregister(session._id)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {renderSessions("In Progress", inProgress, "inProgress")}
      {renderSessions("Upcoming", upcoming, "upcoming")}
      {renderSessions("Past Sessions", past, "past")}
    </div>
  );
}
